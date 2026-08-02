const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEY = process.env.GEOAPIFY_API_KEY;
const BASE_URL = "https://api.geoapify.com/v2/places";

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius (km)

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(1);
}

// ============================
// Nearby Theaters
// GET /api/theaters/nearby?lat=28.6139&lon=77.2090
// ============================
router.get("/nearby", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({
            success: false,
            message: "Latitude and Longitude are required."
        });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                categories: "entertainment.cinema",
                filter: `circle:${lon},${lat},30000`,
                bias: `proximity:${lon},${lat}`,
                limit: 20,
                apiKey: API_KEY
            }
        });
        
        console.log("Geoapify raw response:");
console.log(response.data);
       const theaters = response.data.features.map(place => ({
    id: place.properties.place_id,
    name: place.properties.name || "Unknown Theater",
    address: place.properties.formatted,
    latitude: place.properties.lat,
    longitude: place.properties.lon,

    distance: calculateDistance(
        Number(lat),
        Number(lon),
        place.properties.lat,
        place.properties.lon
    )
}));
console.log(theaters[0]);
        res.json({
            success: true,
            count: theaters.length,
            theaters
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch nearby theaters."
        });
    }
});


// ============================
// Search Theaters By City
// GET /api/theaters/city?city=Mumbai
// ============================
router.get("/city", async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({
            success: false,
            message: "City is required."
        });
    }

    try {

        // STEP 1: Get city coordinates
        const geoResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: city,
                    apiKey: API_KEY
                }
            }
        );

        if (geoResponse.data.features.length === 0) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        const { lat, lon } = geoResponse.data.features[0].properties;

        console.log("Lat:", lat);
        console.log("Lon:", lon);

        // STEP 2: Search theaters around the city
      const theaterResponse = await axios.get(BASE_URL, {
    params: {
        categories: "entertainment.cinema",
        filter: `circle:${lon},${lat},30000`,
        bias: `proximity:${lon},${lat}`,
        limit: 50,
        apiKey: API_KEY
    }
});
console.log("Status:", theaterResponse.status);
console.log("Features:", theaterResponse.data.features?.length);

console.log(theaterResponse.data);

console.log("Geoapify Response:");
console.log(JSON.stringify(theaterResponse.data, null, 2));

if (!theaterResponse.data.features || !Array.isArray(theaterResponse.data.features)) {
    return res.status(500).json({
        success: false,
        message: "Invalid response from Geoapify",
        data: theaterResponse.data
    });
}
const theaters = theaterResponse.data.features.map(place => ({
    id: place.properties.place_id || "",
    name: place.properties.name || "Unknown Theater",
    address: place.properties.formatted || "",
    latitude: place.properties.lat,
    longitude: place.properties.lon,

    distance: calculateDistance(
        Number(lat),
        Number(lon),
        place.properties.lat,
        place.properties.lon
    )
}));

        res.json({
            success: true,
            city,
            latitude: lat,
            longitude: lon,
            count: theaters.length,
            theaters
        });

    } catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
}
});

module.exports = router;
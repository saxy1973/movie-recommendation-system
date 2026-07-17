const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const query = `
      [out:json];
      (
        node["amenity"="cinema"](around:5000,${lat},${lon});
        way["amenity"="cinema"](around:5000,${lat},${lon});
        relation["amenity"="cinema"](around:5000,${lat},${lon});
      );
      out center;
    `;

    const response = await axios.post(
  "https://overpass-api.de/api/interpreter",
  `data=${encodeURIComponent(query)}`,
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "User-Agent": "MovieRecommendationSystem/1.0"
    },
    timeout: 15000
  }
);

const theaters = response.data.elements
  .filter((item) => item.tags?.abandoned !== "yes")
  .map((item) => ({
    id: item.id,
    name:
      item.tags?.name ||
      item.tags?.["name:en"] ||
      "Unknown Theater",

    latitude: item.lat || item.center?.lat,
    longitude: item.lon || item.center?.lon,

    brand: item.tags?.brand || "",
    city: item.tags?.["addr:city"] || "",
    postcode: item.tags?.["addr:postcode"] || "",

    wheelchair: item.tags?.wheelchair || "unknown",

    type: item.type,

    mapUrl: `https://www.openstreetmap.org/?mlat=${
  item.lat || item.center?.lat
}&mlon=${
  item.lon || item.center?.lon
}#map=18/${
  item.lat || item.center?.lat
}/${
  item.lon || item.center?.lon
}`,
  }));

res.json({
  success: true,
  count: theaters.length,
  theaters,
});

  } catch (error) {
  console.log("========== OVERPASS ERROR ==========");
  console.log("Message:", error.message);
  console.log("Code:", error.code);
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);
  console.log("===================================");

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});

module.exports = router;

router.get("/city", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: city,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "MovieRecommendationSystem/1.0",
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    const place = response.data[0];

    res.json({
      success: true,
      city: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
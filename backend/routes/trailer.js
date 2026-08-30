const express = require("express");
const axios = require("axios");

const router = express.Router();


router.get("/:id", async (req, res) => {

  try {

    const movieId = req.params.id;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required"
      });
    }

    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB API key is not configured"
      });
    }

    console.log("TRAILER MOVIE ID:", movieId);


    // 1. Get Movie Details (title ke liye)
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params:{
          api_key: process.env.TMDB_API_KEY,
          language:"en-US"
        }
      }
    );


    const movieTitle = movieResponse.data?.title || "Movie";



    // 2. TMDB Trailer Check
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        params:{
          api_key: process.env.TMDB_API_KEY,
          language:"en-US"
        }
      }
    );


    const videos = Array.isArray(response.data?.results)
      ? response.data.results
      : [];


    const trailer =
      videos.find(
        v =>
        v.site === "YouTube" &&
        v.official &&
        v.type === "Trailer"
      )
      ||
      videos.find(
        v =>
        v.site === "YouTube" &&
        v.type === "Trailer"
      );


    // TMDB trailer mil gaya
    if(trailer){

      return res.json({
        success:true,
        source:"TMDB",
        trailer
      });

    }



    // 3. YouTube API fallback

    const youtubeResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params:{
          key: process.env.YOUTUBE_API_KEY,
          q:`${movieTitle} official trailer`,
          part:"snippet",
          maxResults:5,
          type:"video"
        }
      }
    );


    const youtubeVideo =
      youtubeResponse.data.items[0];


    if(youtubeVideo){

      return res.json({

        success:true,
        source:"YouTube",

        trailer:{
          name: youtubeVideo.snippet.title,
          key: youtubeVideo.id.videoId,
          site:"YouTube"
        }

      });

    }



    res.json({
      success:true,
      trailer:null
    });



  } catch(error){

    console.log(
      error.response?.data || error.message
    );


    res.status(500).json({
      success:false,
      message:error.message
    });

  }

});


module.exports = router;
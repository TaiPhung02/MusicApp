const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/deezer/chart", async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const index = req.query.index || 0;

    const response = await axios.get(`https://api.deezer.com/chart/0/tracks?limit=${limit}&index=${index}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/deezer/track/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;
    const response = await axios.get(`https://api.deezer.com/track/${trackId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch track details" });
  }
});

app.get("/api/deezer/artist/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    const response = await axios.get(`https://api.deezer.com/artist/${artistId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artist details" });
  }
});

app.get("/api/deezer/artist/:artistId/top", async (req, res) => {
  try {
    const { artistId } = req.params;
    const limit = req.query.limit || 10;

    const response = await axios.get(
      `https://api.deezer.com/artist/${artistId}/top?limit=${limit}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist's top tracks:", error);
    res.status(500).json({ error: "Failed to fetch artist's top tracks" });
  }
});

app.get("/api/deezer/album/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await axios.get(`https://api.deezer.com/album/${albumId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching album details:", error);
    res.status(500).json({ error: "Failed to fetch album details" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

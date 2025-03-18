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

    const response = await axios.get(
      `https://api.deezer.com/chart/0/tracks?limit=${limit}&index=${index}`
    );
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
    const response = await axios.get(
      `https://api.deezer.com/artist/${artistId}`
    );
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

app.get("/api/deezer/artist/:artistId/albums", async (req, res) => {
  try {
    const { artistId } = req.params;
    const limit = req.query.limit || 10;
    const index = req.query.index || 0;

    const response = await axios.get(
      `https://api.deezer.com/artist/${artistId}/albums?limit=${limit}&index=${index}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist's albums:", error);
    res.status(500).json({ error: "Failed to fetch artist's albums" });
  }
});

app.get("/api/deezer/album/:albumId/tracks", async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await axios.get(
      `https://api.deezer.com/album/${albumId}/tracks`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching album tracklist:", error);
    res.status(500).json({ error: "Failed to fetch album tracklist" });
  }
});

app.get("/api/deezer/chart/albums", async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const index = req.query.index || 0;

    const response = await axios.get(
      `https://api.deezer.com/chart/0/albums?limit=${limit}&index=${index}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch albums chart" });
  }
});

app.get("/api/deezer/chart/artists", async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const index = req.query.index || 0;

    const response = await axios.get(
      `https://api.deezer.com/chart/0/artists?limit=${limit}&index=${index}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

app.get("/api/deezer/chart/playlists", async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const index = req.query.index || 0;

    const response = await axios.get(
      `https://api.deezer.com/chart/0/playlists?limit=${limit}&index=${index}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

app.get("/api/deezer/playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const response = await axios.get(
      `https://api.deezer.com/playlist/${playlistId}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlist details" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

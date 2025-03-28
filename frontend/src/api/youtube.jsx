const API_KEYS = import.meta.env.VITE_YOUTUBE_API_KEYS.split(",");
let currentKeyIndex = 0;

export async function searchYouTube(songName, artist) {
  const query = encodeURIComponent(`${songName} ${artist}`);

  while (currentKeyIndex < API_KEYS.length) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEYS[currentKeyIndex]}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.warn(
          `API Key ${API_KEYS[currentKeyIndex]} bị lỗi:`,
          data.error.message
        );
        currentKeyIndex++;
        continue;
      }

      if (data.items.length > 0) {
        return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
      }
    } catch (error) {
      console.error("Error fetching from YouTube API:", error);
    }

    return null;
  }

  console.error("Hết API Keys khả dụng!");
  return null;
}

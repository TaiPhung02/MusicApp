const API_KEYS = import.meta.env.VITE_YOUTUBE_API_KEYS?.split(",") || [];
let currentKeyIndex = 0;

export async function searchYouTube(songName, artist) {
  console.log("📌 API Keys từ .env:", import.meta.env.VITE_YOUTUBE_API_KEYS);
  console.log("🔑 Danh sách API Keys:", API_KEYS);
  console.log("🎵 Đang tìm kiếm trên YouTube:", songName, "-", artist);

  const query = encodeURIComponent(`${songName} ${artist} official audio`);

  if (API_KEYS.length === 0) {
    console.error("❌ Không có API Key nào được load từ .env!");
    return null;
  }

  while (currentKeyIndex < API_KEYS.length) {
    const apiKey = API_KEYS[currentKeyIndex];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`;

    console.log(
      `🔎 Fetching YouTube API với Key [${currentKeyIndex}]: ${apiKey}`
    );
    console.log(`🌍 API URL: ${url}`);

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("📩 API Response:", JSON.stringify(data, null, 2));

      if (data.error) {
        console.warn(`⚠️ API Key ${apiKey} bị lỗi:`, data.error.message);
        currentKeyIndex++;
        continue;
      }

      if (data.items?.length > 0) {
        const videoId = data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log("✅ Video tìm được:", videoUrl);
        return videoUrl;
      } else {
        console.warn("⚠️ Không tìm thấy video phù hợp.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi fetch YouTube API:", error);
    }

    return null;
  }

  console.error("⛔ Hết API Keys khả dụng!");
  return null;
}

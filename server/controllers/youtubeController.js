import axios from "axios";

export const searchYoutube = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q,
          type: "video",
          maxResults: 15,
          videoCategoryId: "10",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const songs = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,

      thumbnail:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url,

      publishedAt: item.snippet.publishedAt,
    }));

    res.status(200).json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    console.error(
      "YouTube Search Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to search YouTube",
    });
  }
};
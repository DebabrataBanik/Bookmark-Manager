// import { scrape } from "../utils/scrapeUrl.js";
import { Bookmark } from "../models/Bookmark.js";

export async function getBookmarks(req, res){
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 })
    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ error: error, message: error.message })
  }
}
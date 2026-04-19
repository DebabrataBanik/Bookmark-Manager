// import { scrape } from "../utils/scrapeUrl.js";
import { Bookmark } from "../models/Bookmark.js";

export async function getBookmarks(req, res){
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 })
    res.json(bookmarks)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
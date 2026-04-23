import { scrape } from "../utils/scrapeUrl.js";
import { Bookmark } from "../models/Bookmark.js";
import mongoose from "mongoose";
import { bookmarkSchema } from "../schema/BookmarkSchema.js";

function sanitizeData(text){
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getBookmarks(req, res){
  try {
    const { category, search } = req.query
    let filter = {}
    if(category){
      const tags = category.split(',')
      filter.category = { $in: tags }
    }

    if(search){
      const searchStr = sanitizeData(search)
      filter.title = { $regex: searchStr, $options: 'i' }
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 })
    res.json(bookmarks)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export async function addBookmark(req, res){
  try {
    const result = bookmarkSchema.safeParse(req.body)

    if(!result.success){
      const formatted = result.error.flatten().fieldErrors
      return res.status(400).json(formatted)
    }

    let { url, title, description, category } = result.data

    const scrapeRes = await scrape(url)

    if(!scrapeRes.success){
      return res.status(500).json({ message: "Could not scrape data for that url" })
    }
    
    const metadata = scrapeRes.metadata

    const bookmarkData = {
      url, 
      title, 
      description: description || metadata.description || '',
      publisher: metadata.publisher || '',
      author: metadata.author || '',
      domain: new URL(url).hostname.replace(/^www\./, ''),
      date: metadata.date || new Date().toISOString(),
      category
    }

    const savedBookmark = await Bookmark.create(bookmarkData)

    res.status(201).json({ message: 'Bookmark successfully added!', data: savedBookmark })

  } catch (error) {
    if(error.code === 11000){
      return res.status(409).json({ message: 'Bookmark already exists. '})
    }

    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export async function deleteBookmark(req, res){
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }

    const result = await Bookmark.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Bookmark not found' })
    }

    res.status(200).json({  message: 'Bookmark deleted successfully' })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
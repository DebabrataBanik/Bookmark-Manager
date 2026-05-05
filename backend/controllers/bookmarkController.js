import { scrape } from "../utils/scrapeUrl.js";
import { Bookmark } from "../models/Bookmark.js";
import mongoose from "mongoose";
import { bookmarkSchema } from "../schema/BookmarkSchema.js";

function escapeRegex(text){
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const sortMap = {
  add: { createdAt: -1 },
  visit: { lastVisited: -1 },
  most: { count: -1 }
}

export async function getBookmarks(req, res){
  try {
    const { category, search, sortBy, archived } = req.query
    let filter = {
      archived: archived === 'true'
    }
    if(category){
      const tags = category.split(',')
      filter.category = { $in: tags }
    }

    if(search){
      const searchStr = escapeRegex(search)
      filter.title = { $regex: searchStr, $options: 'i' }
    }

    const sort = sortMap[sortBy] || { createdAt: -1 }

    const bookmarks = await Bookmark.find(filter).sort(sort)
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
      title: title || metadata.title || '', 
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

export async function updateBookmark(req, res){
  try {
    const { id }  = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }

    const result = bookmarkSchema.safeParse(req.body)

    if(!result.success){
      const formatted = result.error.flatten().fieldErrors
      return res.status(400).json(formatted)
    }

    let { url, title, description, category } = result.data

    const existing = await Bookmark.findById(id)

    if(!existing){
      return res.status(404).json({ message: 'Bookmark not found' })
    }

    const isUrlDifferent = existing.url !== url

    let metadata = {}
    
    if(isUrlDifferent){
      const scrapeRes = await scrape(url)

      if(!scrapeRes.success){
        return res.status(500).json({ message: "Could not scrape data for that url" })
      }
      
      metadata = scrapeRes.metadata
    }

    const bookmarkData = {
      url, 
      title: title || (isUrlDifferent ? metadata.title : existing.title), 
      description: description || (isUrlDifferent ? metadata.description : existing.description) || '',
      publisher: isUrlDifferent ? metadata.publisher : existing.publisher,
      author: isUrlDifferent ? metadata.author : existing.author,
      domain: isUrlDifferent ? new URL(url).hostname.replace(/^www\./, '') : existing.domain,
      date: isUrlDifferent ? metadata.date || new Date().toISOString() : existing.date,
      category
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate({ _id: id }, bookmarkData, { returnDocument: 'after', runValidators: true })

    res.status(200).json({ message: 'Bookmark successfully updated', data: updatedBookmark })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export async function pinBookmark(req, res){
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }

    const existingBookmark = await Bookmark.findById(id)
    if(!existingBookmark){
      return res.status(404).json({ message: 'No bookmark found'})
    }
    existingBookmark.pinned = !existingBookmark.pinned
    const updatedBookmark = await existingBookmark.save()

    res.status(200).json(updatedBookmark)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export async function updateBookmarkOnVisit(req, res){
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }

    const updatedBookmark = await Bookmark.findByIdAndUpdate(id, {
        $inc: {count: 1},
        $set: {lastVisited: new Date()}
      },
      { returnDocument: 'after', runValidators: true }
    )
    if(!updatedBookmark){
      return res.status(404).json({ message: 'No bookmark found' })
    }

    res.json(updatedBookmark)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export async function archiveBookmark(req, res){
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }

    const existingBookmark = await Bookmark.findById(id)
    if(!existingBookmark){
      return res.status(404).json({ message: 'No bookmark found'})
    }
    existingBookmark.archived = !existingBookmark.archived
    const updatedBookmark = await existingBookmark.save()

    res.status(200).json(updatedBookmark)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
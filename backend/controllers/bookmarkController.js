import { scrape } from "../utils/scrapeUrl.js";
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

export async function addBookmark(req, res){
  try {
    let { url, title, description, category } = req.body

    url = url.trim()
    title = title.trim()
    description = description?.trim() || ''
    category = category?.trim() || ''

    if(!url || !title){
      return res.status(400).json({ message: 'Required fields are missing.' })
    }

    const scrapeRes = await scrape(url)

    if(!scrapeRes.success){
      return res.status(500).json({ message: 'Scraping failed '})
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
      category: category ? category.split(',').map(tag => tag.trim()) : []
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
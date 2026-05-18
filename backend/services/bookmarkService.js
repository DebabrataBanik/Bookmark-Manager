import sanitizeHtml from 'sanitize-html'
import { scrape } from '../utils/scrapeUrl.js'
import { Bookmark } from '../models/Bookmark.js'
import ApiError from '../utils/ApiError.js'

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const sortMap = {
  add: { createdAt: -1 },
  visit: { lastVisited: -1 },
  most: { count: -1 }
}

export async function getBookmarks({ category, search, sortBy, archived, pinned }){
  let filter = {
    archived: archived === 'true'
  }
  if (pinned) {
    filter.pinned = pinned === 'true'
  }
  if (category) {
    const tags = category.split(',')
    filter.category = { $in: tags }
  }

  if (search) {
    if(search.length > 200){
      throw new ApiError(400, 'Search query too long')
    }
    const searchStr = escapeRegex(search)
    filter.title = { $regex: searchStr, $options: 'i' }
  }

  const sort = sortMap[sortBy] || { createdAt: -1 }

  const bookmarks = await Bookmark.find(filter).sort(sort)
  return bookmarks
}

export async function createBookmark({url, title, description, category}){
  const cleanTitle = sanitizeHtml(title || '')
  const cleanDescription = sanitizeHtml(description || '')

  const scrapeRes = await scrape(url)
  const metadata = scrapeRes.success ? scrapeRes.metadata : {}

  let domain = new URL(url).hostname.replace(/^www\./, '')

  return Bookmark.create({
    url,
    title: cleanTitle || metadata.title || '',
    description: cleanDescription || metadata.description || '',
    publisher: metadata.publisher || '',
    author: metadata.author || '',
    domain,
    date: metadata.date || new Date().toISOString(),
    category
  })
}

export async function updateBookmark({id, url, title, description, category}){
  
  const cleanTitle = sanitizeHtml(title || '')
  const cleanDescription = sanitizeHtml(description || '')

  const existing = await Bookmark.findById(id)

  if (!existing) {
    throw new ApiError(404, 'Bookmark not found')
  }

  const isUrlDifferent = existing.url !== url

  let metadata = {}

  if (isUrlDifferent) {
    const scrapeRes = await scrape(url)
    metadata = scrapeRes.success ? scrapeRes.metadata : {}
  }

  let domain = existing.domain
  if(isUrlDifferent){
    domain = new URL(url).hostname.replace(/^www\./, '')
  }

  const bookmarkData = {
    url,
    title: cleanTitle || (isUrlDifferent ? metadata.title : existing.title),
    description: cleanDescription || (isUrlDifferent ? metadata.description : existing.description) || '',
    publisher: isUrlDifferent ? metadata.publisher : existing.publisher,
    author: isUrlDifferent ? metadata.author : existing.author,
    domain,
    date: isUrlDifferent ? metadata.date || new Date().toISOString() : existing.date,
    category
  }

  const updatedBookmark = await Bookmark.findOneAndUpdate({ _id: id }, bookmarkData, { returnDocument: 'after', runValidators: true })
  return updatedBookmark
}

export async function deleteBookmark(id){
  const deleteRes = await Bookmark.deleteOne({ _id: id})
  
  if(deleteRes.deletedCount === 0){
    throw new ApiError(404, 'Bookmark not found')
  }
}

export async function pinBookmark(id){
  const existingBookmark = await Bookmark.findById(id)
  if(!existingBookmark){
    throw new ApiError(404, 'No bookmark found')
  }
  existingBookmark.pinned = !existingBookmark.pinned
  return existingBookmark.save()
}

export async function updateBookmarkOnVisit(id){
  const updatedBookmark = await Bookmark.findByIdAndUpdate(id, {
    $inc: { count: 1 },
    $set: { lastVisited: new Date() }
  },
    { returnDocument: 'after', runValidators: true }
  )
  if (!updatedBookmark) {
    throw new ApiError(404, 'Boomark not found')
  }
  return updatedBookmark
}

export async function archiveBookmark(id, state){
  const updatedBookmark = await Bookmark.findByIdAndUpdate(id,
    { archived: state },
    { returnDocument: 'after', runValidators: true }
  )
  if (!updatedBookmark) {
    throw new ApiError(404, 'Boomark not found')
  }
  return updatedBookmark
}
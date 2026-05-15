import mongoose from "mongoose";
import { bookmarkSchema } from "../schema/BookmarkSchema.js";
import * as bookmarkService from '../services/bookmarkService.js';

export async function getBookmarks(req, res) {
  const bookmarks = await bookmarkService.getBookmarks(req.query)
  res.json(bookmarks)
}

export async function createBookmark(req, res) {
  const result = bookmarkSchema.safeParse(req.body)

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors
    return res.status(400).json(formatted)
  }
  const bookmark = await bookmarkService.createBookmark(result.data)   
  res.status(201).json({ message: 'Bookmark successfully added!', data: bookmark })
}

export async function deleteBookmark(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  await bookmarkService.deleteBookmark(id)

  res.json({ message: 'Bookmark deleted successfully' })
}

export async function updateBookmark(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  const result = bookmarkSchema.safeParse(req.body)

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors
    return res.status(400).json(formatted)
  }

  const updatedBookmark = await bookmarkService.updateBookmark({id, ...result.data})

  res.json({ message: 'Bookmark successfully updated', data: updatedBookmark })
}

export async function pinBookmark(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  const updatedBookmark = await bookmarkService.pinBookmark(id)
  res.json(updatedBookmark)
}

export async function updateBookmarkOnVisit(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  const updatedBookmark = await bookmarkService.updateBookmarkOnVisit(id)
  res.json(updatedBookmark)
}

export async function archiveBookmark(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  const { state } = req.body

  if (typeof state !== 'boolean') {
    return res.status(400).json({ message: 'Invalid archived state' })
  }

  const updatedBookmark = await bookmarkService.archiveBookmark(id, state)

  res.json(updatedBookmark)
}
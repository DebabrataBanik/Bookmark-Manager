import * as bookmarkService from '../services/bookmarkService.js';

export async function getBookmarks(req, res) {
  const bookmarks = await bookmarkService.getBookmarks(req.query)
  res.json(bookmarks)
}

export async function createBookmark(req, res) {
  const bookmark = await bookmarkService.createBookmark(req.validatedBody)   
  res.status(201).json({ message: 'Bookmark successfully added!', data: bookmark })
}

export async function deleteBookmark(req, res) {
  const { id } = req.params
  await bookmarkService.deleteBookmark(id)
  res.json({ message: 'Bookmark deleted successfully' })
}

export async function updateBookmark(req, res) {
  const { id } = req.params
  const updatedBookmark = await bookmarkService.updateBookmark({id, ...req.validatedBody})
  res.json({ message: 'Bookmark successfully updated', data: updatedBookmark })
}

export async function pinBookmark(req, res) {
  const { id } = req.params
  const updatedBookmark = await bookmarkService.pinBookmark(id)
  res.status(204).send()
}

export async function updateBookmarkOnVisit(req, res) {
  const { id } = req.params
  const updatedBookmark = await bookmarkService.updateBookmarkOnVisit(id)
  res.status(204).send()
}

export async function archiveBookmark(req, res) {
  const { id } = req.params
  const { state } = req.body
  const updatedBookmark = await bookmarkService.archiveBookmark(id, state)
  res.status(204).send()
}
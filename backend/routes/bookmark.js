import express from 'express'
import { addBookmark, getBookmarks, deleteBookmark, updateBookmark, pinBookmark, archiveBookmark, updateBookmarkOnVisit } from '../controllers/bookmarkController.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/', addBookmark)

bookmarkRouter.put('/:id', updateBookmark)
bookmarkRouter.delete('/:id', deleteBookmark)

bookmarkRouter.patch('/:id/pin', pinBookmark)
bookmarkRouter.patch('/:id/archive', archiveBookmark)
bookmarkRouter.patch('/:id/visit', updateBookmarkOnVisit)
import express from 'express'
import { createBookmark, getBookmarks, deleteBookmark, updateBookmark, pinBookmark, archiveBookmark, updateBookmarkOnVisit } from '../controllers/bookmarkController.js'
import { validateBody, validateId, validateArchiveState } from '../middleware/bookmarkValidation.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/',  validateBody, createBookmark)

bookmarkRouter.put('/:id', validateId, validateBody, updateBookmark)
bookmarkRouter.delete('/:id', validateId, deleteBookmark)

bookmarkRouter.patch('/:id/pin', validateId, pinBookmark)
bookmarkRouter.patch('/:id/archive', validateId, validateArchiveState, archiveBookmark)
bookmarkRouter.patch('/:id/visit', validateId, updateBookmarkOnVisit)
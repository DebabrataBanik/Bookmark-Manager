import express from 'express'
import { createBookmark, getBookmarks, deleteBookmark, updateBookmark, pinBookmark, archiveBookmark, updateBookmarkOnVisit } from '../controllers/bookmarkController.js'
import { validateBody, validateId, validateArchiveState } from '../middleware/bookmarkValidation.js'
import { mutationLimiter } from '../middleware/rateLimiter.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/', mutationLimiter, validateBody, createBookmark)

bookmarkRouter.put('/:id', mutationLimiter, validateId, validateBody, updateBookmark)
bookmarkRouter.delete('/:id', mutationLimiter, validateId, deleteBookmark)

bookmarkRouter.patch('/:id/pin', mutationLimiter, validateId, pinBookmark)
bookmarkRouter.patch('/:id/archive', mutationLimiter, validateId, validateArchiveState, archiveBookmark)
bookmarkRouter.patch('/:id/visit', validateId, updateBookmarkOnVisit)
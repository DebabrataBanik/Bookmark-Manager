import express from 'express'
import { addBookmark, getBookmarks, deleteBookmark, updateBookmark, pinBookmark } from '../controllers/bookmarkController.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/add', addBookmark)
bookmarkRouter.delete('/bookmark/:id', deleteBookmark)
bookmarkRouter.put('/bookmark/:id', updateBookmark)
bookmarkRouter.patch('/bookmark/:id', pinBookmark)
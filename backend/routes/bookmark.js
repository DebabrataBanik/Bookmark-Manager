import express from 'express'
import { addBookmark, getBookmarks, deleteBookmark } from '../controllers/bookmarkController.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/add', addBookmark)
bookmarkRouter.delete('/bookmark/:id', deleteBookmark)
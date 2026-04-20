import express from 'express'
import { addBookmark, getBookmarks } from '../controllers/bookmarkController.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/add', addBookmark)
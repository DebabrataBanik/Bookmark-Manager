import express from 'express'
import { addBookmark, getBookmarks, deleteBookmark, updateBookmark, pinBookmark, archiveBookmark, getArchivedBookmarks } from '../controllers/bookmarkController.js'

export const bookmarkRouter = express.Router()

bookmarkRouter.get('/', getBookmarks)
bookmarkRouter.post('/add', addBookmark)
bookmarkRouter.delete('/bookmark/:id', deleteBookmark)
bookmarkRouter.put('/bookmark/:id', updateBookmark)
bookmarkRouter.patch('/bookmark/:id', pinBookmark)
bookmarkRouter.patch('/bookmark/archive/:id', archiveBookmark)
bookmarkRouter.get('/bookmarks/archive', getArchivedBookmarks)
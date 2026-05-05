import express from 'express'
import cors from 'cors'
import { bookmarkRouter } from './routes/bookmark.js'
import { categoryRouter } from './routes/category.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/api/bookmarks', bookmarkRouter)
app.use('/api/categories', categoryRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Invalid Route'})
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`server at http://localhost:${PORT}`))
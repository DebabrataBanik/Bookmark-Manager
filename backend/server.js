import express from 'express'
import cors from 'cors'
import { bookmarkRouter } from './routes/bookmark.js'
import { categoryRouter } from './routes/category.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import helmet from 'helmet'

dotenv.config()

const app = express()
app.use(helmet())

const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => {
    if(!origin){
      return callback(null, true)
    }
    if(allowedOrigins.includes(origin)){
      return callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/api/bookmarks', bookmarkRouter)
app.use('/api/categories', categoryRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Invalid Route'})
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`server at http://localhost:${PORT}`))
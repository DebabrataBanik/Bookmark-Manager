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

app.use(express.json({ limit: '20kb' }))

await connectDB()

app.use('/api/bookmarks', bookmarkRouter)
app.use('/api/categories', categoryRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Invalid Route'})
})

app.use((err, req, res, next) => {
  console.error(err)
  if(err.code === 11000){
    return res.status(409).json({ message: 'Bookmark already exists'})
  }
  const status = err.statusCode || 500
  const clientMessage = status === 500 ? 'Internal server error' : err.message
  res.status(status).json({ message: clientMessage })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`server at http://localhost:${PORT}`))
import express from 'express'
import cors from 'cors'
import { closeBrowserless } from './utils/browser.js'
import { bookmarkRouter } from './routes/bookmark.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

await connectDB()

app.use('/api', bookmarkRouter)

app.all('/*splat', (req, res) => {
  res.status(404).send('Not Found')
})

app.listen(process.env.PORT, () => console.log(`server at http://localhost:${process.env.PORT}`))

process.on('SIGINT', async () => { await closeBrowserless(); process.exit(0) })
process.on('SIGTERM', async () => { await closeBrowserless(); process.exit(0) })
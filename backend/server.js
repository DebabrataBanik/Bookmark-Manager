import express from 'express'
import cors from 'cors'
import { closeBrowserless } from './utils/browser.js'
import { bookmarkRouter } from './routes/bookmark.js'

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api', bookmarkRouter)

app.all('/*splat', (req, res) => {
  res.status(404).send('Not Found')
})

app.listen(8000, () => console.log('server at http://localhost:8000'))

process.on('SIGINT', async () => { await closeBrowserless(); process.exit(0) })
process.on('SIGTERM', async () => { await closeBrowserless(); process.exit(0) })
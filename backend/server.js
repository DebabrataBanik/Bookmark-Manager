import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  return res.json({ message: 'Hello' })
})

app.all('/*splat', (req, res) => {
  res.status(404).send('Not Found')
})

app.listen(8000, () => console.log('server at http://localhost:8000'))
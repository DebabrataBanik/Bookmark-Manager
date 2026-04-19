import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    title: String,
    description: String,
    publisher: String,
    author: String,
    domain: String,
    date: String,
    category: [String]
  },
  { timestamps: true }
)

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
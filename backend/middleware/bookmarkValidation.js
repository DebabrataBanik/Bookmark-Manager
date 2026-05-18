import mongoose from "mongoose"
import { bookmarkSchema } from '../schema/BookmarkSchema.js';

export function validateBody(req, res, next){
  const result = bookmarkSchema.safeParse(req.body)
  
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors
    const message = Object.values(formatted).flat().join(', ')
    return res.status(400).json({ message })
  }
  req.validatedBody = result.data
  next()
}

export function validateId(req, res, next){
  const {id} = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }
  next()
}

export function validateArchiveState(req, res, next){
  const {state} = req.body
  if (typeof state !== 'boolean') {
    return res.status(400).json({ message: 'Invalid archived state' })
  }
  next()
}
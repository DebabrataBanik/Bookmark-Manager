import { Bookmark } from "../models/Bookmark.js"

export async function getCategories(req, res){
  try {
    const categories = await Bookmark.distinct('category')
    res.json(categories)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
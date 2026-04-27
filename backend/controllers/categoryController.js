import { Bookmark } from "../models/Bookmark.js"

export async function getCategories(req, res){
  try {
    const categories = await Bookmark.aggregate([
      { $match: { archived: false }},
      { $unwind: "$category"},
      { $group: { _id: "$category", count: { $sum : 1 }}},
      { $sort: { _id: 1 }}
    ])

    res.json(categories.map(c => ({
      name: c._id,
      count: c.count
    })))
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
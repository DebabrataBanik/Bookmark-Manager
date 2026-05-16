import { Bookmark } from '../models/Bookmark.js'

export async function getCategories(){
  const categories = await Bookmark.aggregate([
    { $match: { archived: false }},
    { $unwind: "$category"},
    { $group: { _id: "$category", count: { $sum : 1 }}},
    { $sort: { _id: 1 }}
  ])
  return categories.map(c => ({
    name: c._id,
    count: c.count
  }))
}


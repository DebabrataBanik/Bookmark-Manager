import * as categoryService from '../services/categoryService.js'

export async function getCategories(req, res){
  const categories = await categoryService.getCategories()
  res.json(categories)
}
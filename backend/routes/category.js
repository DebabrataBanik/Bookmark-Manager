import express from 'express'
import { getCategories } from '../controllers/categoryController.js'

export const categoryRouter = express.Router()

categoryRouter.get('/', getCategories)
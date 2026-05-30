import { beforeEach, describe, test, vi, expect } from 'vitest'
import { Bookmark } from '../models/Bookmark.js'
import { getCategories } from './categoryService'

vi.mock('../models/Bookmark.js', () => ({
  Bookmark: {
    aggregate: vi.fn()
  }
}))

describe('Category Service - getCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Bookmark.aggregate.mockResolvedValue([])
  })
  
  test('calls aggregator with correct parameters', async () => {
    await getCategories()
    expect(Bookmark.aggregate).toHaveBeenCalledWith([
      { $match: { archived: false }},
      { $unwind: "$category"},
      { $group: { _id: "$category", count: { $sum : 1 }}},
      { $sort: { _id: 1 }}
    ])
  })

  test('transforms _id to name in returned categories', async () => {
    Bookmark.aggregate.mockResolvedValue([
      { _id: 'React', count: 2 }, 
      { _id: 'Test', count: 4 }
    ])
    const result = await getCategories()
    expect(result).toEqual([
      { name: 'React', count: 2 },
      { name: 'Test', count: 4 }
    ])
  })

  test('returns empty array when no categories exist', async () => {
    Bookmark.aggregate.mockResolvedValue([])
    const result = await getCategories()
    expect(result).toEqual([])
  })
})
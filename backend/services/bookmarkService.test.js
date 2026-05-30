import { test, expect, beforeEach, vi, afterEach, describe } from 'vitest'
import * as bookmarkService from './bookmarkService.js'
import { Bookmark } from '../models/Bookmark.js'
import ApiError from '../utils/ApiError.js'
import { scrape } from '../utils/scrapeUrl.js'

vi.mock('../models/Bookmark.js', () => ({
  Bookmark: {
    find: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOneAndUpdate: vi.fn()
  }
}))

vi.mock('../utils/scrapeUrl.js', () => ({
  scrape: vi.fn()
}))

describe('Bookmark Service', () => { 
  afterEach(() => {
    vi.resetAllMocks()
  })
  
  describe('getBookmarks', () => {
    const mockSort = vi.fn()
    beforeEach(() => {
      mockSort.mockResolvedValue([])
      Bookmark.find.mockReturnValue({ sort: mockSort })
    })
    
    test('throws 404 when search exceeds 200 chracters', async () => {
      await expect(bookmarkService.getBookmarks({
        search: 'a'.repeat(201)
      })).rejects.toMatchObject({ statusCode: 400 })
    })

    describe('filter cases', () => {
      test('filters archived=false by default', async () => {
        await bookmarkService.getBookmarks({})
        expect(Bookmark.find).toHaveBeenCalledWith({ archived: false })
      })

      test('filters archived=true when passed', async () => {
        await bookmarkService.getBookmarks({ archived: 'true' })
        expect(Bookmark.find).toHaveBeenCalledWith({ archived: true })
      })

      test('does not add pinned filter when not passed', async () => {
        await bookmarkService.getBookmarks({})
        const filter = Bookmark.find.mock.calls[0][0]
        expect(filter).not.toHaveProperty('pinned')
      })

      test('adds pinned when passed', async () => {
        await bookmarkService.getBookmarks({ pinned: 'true'})
        expect(Bookmark.find).toHaveBeenCalledWith(
          expect.objectContaining({ pinned: true })
        )
      })

      test('adds category filter when passed', async () => {
        await bookmarkService.getBookmarks({ category: 'test,vitest' })
        expect(Bookmark.find).toHaveBeenCalledWith(
          expect.objectContaining({
            category: expect.objectContaining({ $in: ['test', 'vitest']})
          })
        )
      })

      test('adds title regex filter when search passed', async () => {
        await bookmarkService.getBookmarks({ search: 'test'})
        expect(Bookmark.find).toHaveBeenCalledWith(
          expect.objectContaining({
            title: { $regex: 'test', $options: 'i'}
          })
        )
      })
    })

    describe('sort cases', () => {
      test('sorts by createdAt descending by deafult', async () => {
        await bookmarkService.getBookmarks({})
        expect(mockSort).toHaveBeenCalledWith({ createdAt: -1})
      })

      test('sorts by lastVisited when sortBy=visit', async () => {
        await bookmarkService.getBookmarks({ sortBy: 'visit' })
        expect(mockSort).toHaveBeenCalledWith({ lastVisited: -1})
      })

      test('sorts by count when sortBy=most', async () => {
        await bookmarkService.getBookmarks({ sortBy: 'most' })
        expect(mockSort).toHaveBeenCalledWith({ count: -1})
      })

      test('falls back to createdAt for unknown sort value', async () => {
        await bookmarkService.getBookmarks({ sortBy: 'random' })
        expect(mockSort).toHaveBeenCalledWith({ createdAt: -1})
      })
    })
  })

  describe('createBookmark', () => {
    beforeEach(() => {
      Bookmark.create.mockResolvedValue({ _id: '123' })
    })

    test('should sanitize user data and override metadata', async () => {
      scrape.mockResolvedValue({
        success: true,
        metadata: { title: 'Scraped Title', description: 'Scraped Description' }
      })
      await bookmarkService.createBookmark({
        url: 'https://example.com',
        title: '<h1>Title</h1><script>alert("Attack")</script>',
        description: '<h1>Description</h1><script>alert("Attack")</script>',
        category: []
      })
      expect(Bookmark.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '<h1>Title</h1>',
          description: '<h1>Description</h1>'
        })
      )
    })

    test('uses scraped data when no user input is provided', async () => {
      scrape.mockResolvedValue({
        success: true,
        metadata: {
          title: 'Scraped Title',
          description: 'Scraped Description',
          author: 'Author name'
        }
      })
      await bookmarkService.createBookmark({
        url: 'https://example.com',
        title: '',
        description: '',
        category: []
      })
      expect(Bookmark.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Scraped Title',
          description: 'Scraped Description',
          author: 'Author name'
        })
      )
    })

    test('uses empty strings and fallback timestamp when scrape fails', async () => {
      scrape.mockResolvedValue({
        success: false
      })
      await bookmarkService.createBookmark({
        url: 'https://example.com',
        title: '',
        description: '',
        category: []
      })
      expect(Bookmark.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '',
          description: '',
          date: expect.any(String)
        })
      )
    })

    test('strips domain', async () => {
      scrape.mockResolvedValue({
        success: false
      })
      await bookmarkService.createBookmark({
        url: 'https://www.google.com',
        title: '',
        description: '',
        category: []
      })
      expect(Bookmark.create).toHaveBeenCalledWith(
        expect.objectContaining({
          domain: 'google.com'
        })
      )
    })

    test('should bubble up a MongoDB duplicate key error (code 11000) if URL already exists', async () => {
      scrape.mockResolvedValue({ success: false })

      const mongoDuplicateError = new Error('E11000 duplicate key error collection')
      mongoDuplicateError.code = 11000 
      
      Bookmark.create.mockRejectedValue(mongoDuplicateError)

      await expect(bookmarkService.createBookmark({
        url: 'https://existing.com',
        title: 'Duplicate',
        description: '',
        category: []
      })
      ).rejects.toThrowError(/duplicate key error/i)
    })
  })

  describe('updateBookmark', () => {
    const existingDoc = {
      _id: '123',
      url: 'https://example.com',
      title: 'Old Title',
      description: 'Old Description',
      publisher: '',
      author: 'name',
      domain: 'example.com',
      date: '2026-5-29'
    }
    beforeEach(() => {
      Bookmark.findById.mockResolvedValue(existingDoc)
      Bookmark.findOneAndUpdate.mockResolvedValue({ _id: '123' })
    })
    test('throw 404 when bookmark does not exist', async () => {
      Bookmark.findById.mockResolvedValue(null)
      await expect(bookmarkService.updateBookmark({
        id: 'fakeId',
        url: 'https://example.com',
        tite: '',
        description: '',
        category: []
      })).rejects.toMatchObject({ statusCode: 404 })
    })

    test('does not call scrape if url is not changed', async () => {
      await bookmarkService.updateBookmark({
        id: '123',
        url: 'https://example.com',
        title: '',
        description: '',
        category: []
      })
      expect(scrape).not.toHaveBeenCalled()
    })

    test('keeps existing metadata when url is unchanged', async () => {
      await bookmarkService.updateBookmark({
        id: '123',
        url: 'https://example.com',
        title: '',
        description: '',
        category: []
      })
      expect(Bookmark.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        expect.objectContaining({
          url: 'https://example.com',
          title: 'Old Title',
          description: 'Old Description',
          publisher: '',
          author: 'name',
          domain: 'example.com',
          date: '2026-5-29'
        }),
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
    })

    test('calls scrape when url changes', async () => {
      scrape.mockResolvedValue({ success: false })
      await bookmarkService.updateBookmark({
        id: '123',
        url: 'https://newdomain.com',
        title: 'New Title',
        description: '',
        category: []
      })
      expect(scrape).toHaveBeenCalledWith('https://newdomain.com')
    })

    test('uses scraped metadata when url changes', async () => {
      scrape.mockResolvedValue({
        success: true,
        metadata: {
          title: 'Scraped title',
          description: 'Scraped desc',
          author: 'New author'
        }
      })
      await bookmarkService.updateBookmark({
        id: '123',
        url: 'https://newdomain.com',
        title: '',
        description: '',
        category: []
      })
      expect(Bookmark.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        expect.objectContaining({
          url: 'https://newdomain.com',
          title: 'Scraped title',
          description: 'Scraped desc',
          author: 'New author',
          domain: 'newdomain.com'
        }),
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
    })

    test('uses user data over scraped data when url changes', async () => {
      scrape.mockResolvedValue({
        success: true,
        metadata: {
          title: 'scraped title',
          description: 'scraped desc'
        }
      })
      await bookmarkService.updateBookmark({
        id: '123',
        url: 'https://newdomain.com',
        title: 'User title',
        description: 'User description',
        category: []
      })
      expect(Bookmark.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123' },
        expect.objectContaining({
          url: 'https://newdomain.com',
          title: 'User title',
          description: 'User description'
        }),
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
    })
  })
  
  describe('deleteBookmark', () => {
    test('calls with correct id', async () => {
      Bookmark.deleteOne.mockResolvedValue({ deletedCount: 1 })
      await bookmarkService.deleteBookmark('123')
      expect(Bookmark.deleteOne).toHaveBeenCalledWith({ _id: '123'})
    })
    
    test('throws 404 when bookmark does not exist', async () => {
      Bookmark.deleteOne.mockResolvedValue({ deletedCount: 0 })
      await expect(bookmarkService.deleteBookmark('fakeId')).rejects.toMatchObject({statusCode: 404})
    })
    
    test('resolves without error when bookmark exists', async () => {
      Bookmark.deleteOne.mockResolvedValue({ deletedCount: 1 })
      await expect(bookmarkService.deleteBookmark('validId')).resolves.not.toThrow()
    })
  })
  
  describe('pinBookmark', () => {
    test('calls with correct id', async () => {
      const doc = { pinned: false, save: vi.fn() }
      Bookmark.findById.mockResolvedValue(doc)
      await bookmarkService.pinBookmark('123')
      expect(Bookmark.findById).toHaveBeenCalledWith('123')
    })

    test('throws 404 when bookmark does not exist', async () => {
      Bookmark.findById.mockResolvedValue(null)
      await expect(bookmarkService.pinBookmark('fakeId')).rejects.toMatchObject({ statusCode: 404 })
    })
  
    test('toggles pin from false to true', async () => {
      const doc = { pinned: false, save: vi.fn() }
      Bookmark.findById.mockResolvedValue(doc)
      await bookmarkService.pinBookmark('validId')
      expect(doc.pinned).toBe(true)
    })
  
    test('toggles pin from true to false', async () => {
      const doc = { pinned: true, save: vi.fn() }
      Bookmark.findById.mockResolvedValue(doc)
      await bookmarkService.pinBookmark('validId')
      expect(doc.pinned).toBe(false)
    })
  
    test('calls save after toggle', async () => {
      const doc = { pinned: false, save: vi.fn() }
      Bookmark.findById.mockResolvedValue(doc)
      await bookmarkService.pinBookmark('validId')
      expect(doc.save).toHaveBeenCalledOnce()
    })
  })

  describe('updateBookmarkOnVisit', () => {
    test('calls with correct id and operations', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue({ _id: '123' })
      await bookmarkService.updateBookmarkOnVisit('123')
      expect(Bookmark.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        {
          $inc: { count: 1},
          $set: { lastVisited: expect.any(Date) }
        },
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
    })

    test('throws 404 when bookmark does not exist', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue(null)
      await expect(bookmarkService.updateBookmarkOnVisit('fakeId')).rejects.toMatchObject({ statusCode: 404})
    })

    test('resolves without error when bookmark exists', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue({ _id: '123' })
      await expect(bookmarkService.updateBookmarkOnVisit('123')).resolves.not.toThrow()
    })
  })

  describe('archiveBookmark', () => {
    test('calls with correct id, state and operations', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue({ _id: '123' })
      await bookmarkService.archiveBookmark('123', true)
      expect(Bookmark.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { archived: true },
        { returnDocument: 'after', runValidators: true }
      )
    })

    test('throws 404 when bookmark not found', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue(null)
      await expect(bookmarkService.archiveBookmark('fakeId', true)).rejects.toMatchObject({ statusCode: 404})
    })

    test('resolves without error when bookmark exists', async () => {
      Bookmark.findByIdAndUpdate.mockResolvedValue({ _id: '123'})
      await expect(bookmarkService.archiveBookmark('123', true)).resolves.not.toThrow()
    })
  })
})
import { z } from 'zod'

export const bookmarkSchema = z.object({
  url: z.string().trim().min(1, "URL is required").max(2000, "URL is too long").url({
    protocol: /^https?$/,
    hostname: z.regexes.domain
  }),
  title: z.string().trim().max(200, "Title must be less than 200 characters").optional(),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  category: z.string().trim().max(200, "Too many categories").optional().transform(val => {
    if(!val) return []
    const clean = val.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
    return [...new Set(clean)].slice(0, 10).map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
  })
})
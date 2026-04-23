import { z } from 'zod'

export const bookmarkSchema = z.object({
  url: z.string().trim().min(1, "URL is required").url({
    protocol: /^https?$/,
    hostname: z.regexes.domain
  }),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(80, "Title must be under 80 characters"),
  description: z.string().trim().optional().default(''),
  category: z.string().trim().optional().transform(val => {
    if(!val) return []
    const clean = val.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
    return [...new Set(clean)].map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
  })
})
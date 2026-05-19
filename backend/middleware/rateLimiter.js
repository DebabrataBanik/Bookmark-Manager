import { rateLimit } from 'express-rate-limit'

export const mutationLimiter = rateLimit({
  windowMs: 60*1000,
  limit: 5,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})
import cors from 'cors'

const ALLOW_ORIGIN = ['http://localhost:8000']

export const defaultCors = cors({
  origin(origin, callback) {
    if (origin) {
      if (ALLOW_ORIGIN.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
})

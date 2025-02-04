import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { defaultCors } from './middleware/cors'

// <- Routes
import authRouter from './routes/auth'
import authenticate from './middleware/validate-token'

const app = express()

app.use(morgan('dev'))
// app.use(defaultCors) // <-- Luego se tiene que implementar el cors

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// app.use(authenticate)

app.use('/api', authRouter)

export default app

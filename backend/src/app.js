import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'NodeWaste backend is healthy',
    data: {
      service: 'backend',
    },
  })
})

app.use('/api/auth', authRoutes)
app.use(errorMiddleware)

export default app

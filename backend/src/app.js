import express from 'express'
import cors from 'cors'
import activityRoutes from './routes/activity.routes.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import facilityRoutes from './routes/facility.routes.js'
import petRoutes from './routes/pet.routes.js'
import profileRoutes from './routes/profile.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'https://nodewaste.vercel.app',
]
function normalizeOrigin(origin) {
  return origin.replace(/^['"]|['"]$/g, '').replace(/\/$/, '')
}

const allowedOrigins = [...defaultAllowedOrigins, ...(process.env.CORS_ORIGIN || '').split(',')]
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
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
app.use('/api/profile', profileRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/pet', petRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/recycling-facilities', facilityRoutes)
app.use(errorMiddleware)

export default app

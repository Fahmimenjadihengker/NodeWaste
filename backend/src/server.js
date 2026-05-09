import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/prisma.js'

const port = Number(process.env.PORT || 5000)

try {
  await connectDatabase()

  app.listen(port, () => {
    console.log(`NodeWaste backend running on http://localhost:${port}`)
  })
} catch (error) {
  console.error('Failed to start backend:', error.message)
  process.exit(1)
}

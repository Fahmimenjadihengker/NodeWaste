import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.resolve(__dirname, '../../data')
const usersFile = path.join(dataDirectory, 'users.json')

async function ensureStore() {
  await mkdir(dataDirectory, { recursive: true })

  try {
    await readFile(usersFile, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(usersFile, '[]', 'utf8')
      return
    }

    throw error
  }
}

async function readUsers() {
  await ensureStore()
  const raw = await readFile(usersFile, 'utf8')
  return JSON.parse(raw)
}

async function writeUsers(users) {
  await ensureStore()
  await writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8')
}

export async function findUserByEmail(email) {
  const users = await readUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
}

export async function createUser(user) {
  const users = await readUsers()
  users.push(user)
  await writeUsers(users)
  return user
}

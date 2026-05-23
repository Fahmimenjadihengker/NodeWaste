import { HttpError } from '../utils/http-error.js'

const defaultAiClassifierBaseUrl = 'https://nodewaste-ai-api-production.up.railway.app'
const aiClassifierBaseUrl = (process.env.AI_CLASSIFIER_BASE_URL || defaultAiClassifierBaseUrl).replace(/\/$/, '')
const aiClassifierTimeoutMs = Number(process.env.AI_CLASSIFIER_TIMEOUT_MS || 15000)

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function getErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') return payload.detail
  if (Array.isArray(payload?.detail)) return payload.detail.map((item) => item?.msg).filter(Boolean).join(', ') || fallback
  if (typeof payload?.message === 'string') return payload.message
  if (typeof payload?.error === 'string') return payload.error
  return fallback
}

function findValueByKeys(value, keys) {
  if (!value || typeof value !== 'object') return null

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findValueByKeys(item, keys)
      if (found !== null && found !== undefined && found !== '') return found
    }

    return null
  }

  for (const key of keys) {
    if (value[key] !== null && value[key] !== undefined && value[key] !== '') return value[key]
  }

  for (const item of Object.values(value)) {
    const found = findValueByKeys(item, keys)
    if (found !== null && found !== undefined && found !== '') return found
  }

  return null
}

function normalizeToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function includesAny(value, keywords) {
  const text = normalizeToken(value)
  return keywords.some((keyword) => text.includes(normalizeToken(keyword)))
}

function normalizeCategory(...values) {
  const text = values.filter(Boolean).join(' ')
  const normalized = normalizeToken(text)

  if (normalized === 'b3' || includesAny(text, ['b3', 'battery', 'baterai', 'obat', 'medicine', 'chemical', 'kimia', 'electronic', 'ewaste', 'limbah berbahaya'])) {
    return 'B3'
  }

  if (normalized === 'anorganik' || includesAny(text, ['anorganik', 'plastic', 'plastik', 'bottle', 'botol', 'can', 'kaleng', 'glass', 'kaca', 'paper', 'kertas', 'cardboard', 'karton', 'metal', 'logam'])) {
    return 'Anorganik'
  }

  if (normalized === 'organik' || includesAny(text, ['organik', 'organic', 'food', 'makanan', 'sisa makanan', 'leaf', 'daun', 'fruit', 'buah', 'vegetable', 'sayur', 'compost', 'kompos'])) {
    return 'Organik'
  }

  return 'Anorganik'
}

function normalizeConfidence(value) {
  if (value === null || value === undefined || value === '') return 0

  const parsed = Number(String(value).replace('%', '').trim())
  if (!Number.isFinite(parsed)) return 0

  const percentage = parsed > 0 && parsed <= 1 ? parsed * 100 : parsed
  return Math.max(0, Math.min(100, Math.round(percentage)))
}

function normalizeLabel(value, fallback) {
  const label = String(value || '').trim()
  if (label) return label

  if (fallback === 'Organik') return 'Sampah Organik'
  if (fallback === 'B3') return 'Sampah B3'
  return 'Sampah Anorganik'
}

function normalizeRecommendation(value) {
  if (value && typeof value === 'object') {
    return normalizeRecommendation(value.text || value.message || value.guide || value.panduan)
  }

  const text = String(value || '').trim()
  return text || null
}

export function normalizeAiPrediction(payload) {
  const labelValue = findValueByKeys(payload, ['label', 'class', 'class_name', 'prediction', 'predicted_class', 'jenis', 'name'])
  const categoryValue = findValueByKeys(payload, ['category', 'kategori', 'waste_category', 'wasteCategory'])
  const confidenceValue = findValueByKeys(payload, ['confidence', 'score', 'probability', 'prob', 'akurasi'])
  const recommendationValue = findValueByKeys(payload, ['recommendation', 'rekomendasi', 'guide', 'panduan', 'text'])
  const category = normalizeCategory(categoryValue, labelValue, recommendationValue)

  return {
    category,
    label: normalizeLabel(labelValue || categoryValue, category),
    confidence: normalizeConfidence(confidenceValue),
    recommendation: normalizeRecommendation(recommendationValue),
  }
}

export async function classifyWasteImage(file) {
  if (!file?.buffer?.length) {
    throw new HttpError(400, 'Gambar sampah wajib diunggah')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), aiClassifierTimeoutMs)

  try {
    const formData = new FormData()
    const imageBlob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' })
    formData.append('file', imageBlob, file.originalname || 'scan.jpg')

    const response = await fetch(`${aiClassifierBaseUrl}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
    const responseText = await response.text()
    const payload = parseJson(responseText)

    if (!response.ok) {
      throw new HttpError(502, getErrorMessage(payload, 'AI classifier gagal memproses gambar'))
    }

    if (!payload || typeof payload !== 'object') {
      throw new HttpError(502, 'Response AI classifier tidak valid')
    }

    return normalizeAiPrediction(payload)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new HttpError(502, 'AI classifier timeout')
    }

    if (error instanceof HttpError) throw error

    throw new HttpError(502, 'AI classifier belum bisa dihubungi')
  } finally {
    clearTimeout(timeout)
  }
}

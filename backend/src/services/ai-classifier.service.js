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

function normalizeClassification(value) {
  const text = String(value || '').trim()
  const normalized = normalizeToken(text)

  if (!normalized) return 'Tidak dibakar'
  if (normalized.includes('tidakdibakar') || normalized.includes('janganbakar') || (normalized.includes('jangan') && normalized.includes('bakar'))) return 'Tidak dibakar'
  if (normalized.includes('daurulang') || normalized.includes('recycle') || normalized.includes('recycling')) return 'Daur Ulang'
  if (normalized.includes('berbahaya') || normalized.includes('b3') || normalized.includes('hazard')) return 'Berbahaya'
  if (normalized.includes('dibakar') || normalized.includes('bakar')) return 'Dibakar'

  return text.replace(/\s+/g, ' ').replace(/^./, (char) => char.toUpperCase())
}

function normalizeCategory(value) {
  const text = String(value || '').trim()
  if (!text) return 'Tidak diketahui'

  return text
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase())
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

  return fallback ? `Sampah ${fallback}` : 'Sampah'
}

function normalizeRecommendation(value) {
  if (!value) return null

  if (typeof value === 'object') {
    const keys = Object.keys(value).map(k => k.toLowerCase())
    const hasStructuredKeys = keys.some(k => (
      k.includes('panduan') || k.includes('kantong') || k.includes('klasifikasi') || k.includes('kategori')
    ))

    if (hasStructuredKeys) {
      const normalizedObj = {}
      for (const [k, v] of Object.entries(value)) {
        const lowerKey = k.toLowerCase()
        if (lowerKey.includes('panduan')) normalizedObj['panduan penanganan sampah'] = v
        else if (lowerKey.includes('kantong')) normalizedObj['Letakkan di kantong'] = v
        else if (lowerKey.includes('klasifikasi')) normalizedObj['Klasifikasi jenis sampah'] = v
        else if (lowerKey.includes('kategori')) normalizedObj['Kategori sampah'] = v
        else normalizedObj[k] = v
      }
      return normalizedObj
    }
    return normalizeRecommendation(value.text || value.message || value.guide || value.panduan)
  }

  const text = String(value || '').trim()
  return text || null
}

export function normalizeAiPrediction(payload) {
  const labelValue = findValueByKeys(payload, ['label', 'class', 'class_name', 'prediction', 'predicted_class', 'jenis', 'name'])
  const confidenceValue = findValueByKeys(payload, ['confidence', 'score', 'probability', 'prob', 'akurasi'])
  const recommendationValue = findValueByKeys(payload, ['recommendation', 'rekomendasi', 'guide', 'panduan', 'text'])
  const recommendation = normalizeRecommendation(recommendationValue)
  const recommendationClassification = recommendation && typeof recommendation === 'object'
    ? recommendation['Klasifikasi jenis sampah']
    : null
  const recommendationCategory = recommendation && typeof recommendation === 'object'
    ? recommendation['Kategori sampah']
    : null
  const classificationValue = recommendationClassification || findValueByKeys(payload, [
    'Klasifikasi jenis sampah',
    'klasifikasi_jenis_sampah',
    'jenis_klasifikasi',
    'handling_classification',
    'disposal_classification',
  ])
  const classification = normalizeClassification(classificationValue)
  const categoryValue = recommendationCategory || findValueByKeys(payload, [
    'Kategori sampah',
    'category',
    'kategori',
    'waste_category',
    'wasteCategory',
  ])

  return {
    category: normalizeCategory(categoryValue),
    classification,
    label: normalizeLabel(labelValue, classification),
    confidence: normalizeConfidence(confidenceValue),
    recommendation,
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

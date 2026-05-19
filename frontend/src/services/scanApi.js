import { apiRequest, clearApiCache } from './apiClient.js'

export function createScan(imageBlob) {
  const formData = new FormData()
  formData.append('image', imageBlob, 'scan.jpg')

  return apiRequest('/scans', {
    method: 'POST',
    body: formData,
  }).then((response) => {
    clearApiCache('/dashboard')
    clearApiCache('/profile')
    clearApiCache('/activities')
    return response
  })
}

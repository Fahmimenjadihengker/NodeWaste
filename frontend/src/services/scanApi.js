import { apiRequest } from './apiClient.js'

export function createScan(imageBlob) {
  const formData = new FormData()
  formData.append('image', imageBlob, 'scan.jpg')

  return apiRequest('/scans', {
    method: 'POST',
    body: formData,
  })
}

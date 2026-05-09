function FeedbackMessage({ type = 'error', message }) {
  if (!message) return null

  const toneClass = type === 'success'
    ? 'border-leaf-600 bg-[#e7edda] text-leaf-700'
    : 'border-red-600 bg-red-50 text-red-700'

  return <p className={`border-l px-4 py-3 text-sm font-bold ${toneClass}`}>{message}</p>
}

export default FeedbackMessage

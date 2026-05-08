import useRotatingMessages from '../hooks/useRotatingMessages.js'

const leafyMessages = [
  'Yuk pilah sampah kecil-kecilan hari ini.',
  'Aku senang kalau kamu scan sampah dengan rapi.',
  'Botol plastik jangan lupa dipisahkan ya.',
  'Sisa makanan bisa jadi kompos kalau dikelola benar.',
  'EcoPoints kamu bisa bantu aku tetap bahagia.',
  'Kebiasaan hijau dimulai dari satu langkah kecil.',
  'Kalau ragu, scan dulu biar lebih yakin.',
  'B3 jangan dicampur dengan sampah biasa ya.',
  'Streak harianmu bikin aku makin semangat.',
  'Terima kasih sudah merawat bumi bareng aku.',
]

function LeafySpeechBubble({ className = '' }) {
  const message = useRotatingMessages(leafyMessages, 10000)

  return (
    <div className={`animate-leafy-pop rounded-[1.25rem] border border-moss/10 bg-[#fff8e8] px-4 py-3 text-left text-sm font-black leading-6 text-leaf-900 shadow-[0_18px_45px_rgba(32,58,37,0.12)] ${className}`}>
      <p>{message}</p>
      <span className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-moss/10 bg-[#fff8e8]" aria-hidden="true" />
    </div>
  )
}

export default LeafySpeechBubble

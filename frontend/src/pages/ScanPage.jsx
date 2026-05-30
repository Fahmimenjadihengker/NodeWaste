import { useEffect, useRef, useState } from 'react'
import ScanClassificationPill from '../components/ScanClassificationPill.jsx'
import { createScan } from '../services/scanApi.js'

function getConfidenceLabel(confidence) {
  const value = Number(confidence || 0)
  return `${Math.round(value > 0 && value <= 1 ? value * 100 : value)}%`
}

function CameraPanel({ videoRef, canvasRef, cameraState, errorMessage, onStart, onCapture }) {
  const isCameraReady = cameraState === 'ready'

  return (
    <section className="rounded-[1.5rem] border border-moss/10 bg-[#dce8cf] p-5 shadow-[0_22px_70px_rgba(32,58,37,0.12)] sm:p-7">
      <div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Kamera scan</p>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.25rem] bg-moss/10">
        {isCameraReady ? (
          <div className="relative">
            <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted autoPlay />
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="border border-white/35" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid aspect-[4/3] place-items-center p-8 text-center">
            <div>
              <p className="text-2xl font-black text-leaf-900">Kamera belum aktif</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-moss/65">Klik tombol buka kamera. Jika browser meminta izin, pilih izinkan agar NodeWaste bisa mengambil gambar sampah.</p>
              {errorMessage ? <p className="mx-auto mt-4 max-w-md rounded-xl bg-[#fff8e8] p-4 text-sm font-bold text-moss">{errorMessage}</p> : null}
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6 flex justify-center">
        <button className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" type="button" onClick={isCameraReady ? onCapture : onStart}>
          {isCameraReady ? 'Scan' : 'Buka kamera'}
        </button>
        {errorMessage && !isCameraReady ? (
          <button className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={onStart}>
            Coba buka kamera lagi
          </button>
        ) : null}
      </div>
    </section>
  )
}

function ScanResult({ result, previewUrl, isLoading, onScanAgain }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return undefined

    queueMicrotask(() => setProgress(0))

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval)
          return 90
        }
        return p + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isLoading])

  if (isLoading) {
    const getStageStyle = (threshold) => {
      return progress >= threshold
        ? 'rounded-full bg-leaf-600 px-4 py-3 text-white transition-colors duration-500 shadow-glow'
        : 'rounded-full bg-white/55 px-4 py-3 text-moss/45 transition-colors duration-500'
    }

    return (
      <section className="overflow-hidden rounded-[1.5rem] border border-leaf-600/15 bg-[#fff8e8] p-6 shadow-[0_24px_70px_rgba(32,58,37,0.12)] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {previewUrl ? <img className="aspect-square w-full rounded-[1.25rem] object-cover shadow-[0_18px_42px_rgba(32,58,37,0.12)] sm:w-36" src={previewUrl} alt="Gambar sedang dianalisis" /> : null}
          <div className="flex-1">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Menganalisis</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900 sm:text-4xl">Memproses gambar...</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-moss/60">AI sedang membaca tekstur, bentuk, dan kategori sampah dari foto kamu.</p>
          </div>

        </div>
        <div className="mt-7 overflow-hidden rounded-full bg-moss/10">
          <div className="h-3 rounded-full bg-leaf-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-5 grid gap-3 text-xs font-black uppercase tracking-[0.16em] sm:grid-cols-3">
          <span className={getStageStyle(0)}>Membaca gambar</span>
          <span className={getStageStyle(33)}>Klasifikasi</span>
          <span className={getStageStyle(66)}>Menyiapkan reward</span>
        </div>
      </section>
    )
  }

  if (!result) {
    return (
      <section className="rounded-[1.25rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-moss/45">Hasil scan</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Belum ada hasil.</h2>
        <p className="mt-3 text-sm leading-6 text-moss/65">Buka kamera lalu ambil gambar. Hasil klasifikasi akan muncul setelah gambar diproses.</p>
      </section>
    )
  }

  return (
    <section className={`rounded-[1.25rem] border p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)] ${result.isValid ? 'border-leaf-600/20 bg-[#dce8cf]' : 'border-honey/30 bg-[#fff3cf]'}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {previewUrl ? <img className="aspect-square w-full rounded-[1rem] object-cover sm:w-40" src={previewUrl} alt="Preview hasil scan" /> : null}
        <div className="flex-1">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">{result.isValid ? 'Scan valid' : 'Perlu scan ulang'}</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{result.wasteName}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <ScanClassificationPill classification={result.classification} />
            <span className="rounded-full bg-[#f5f1df] px-4 py-2 text-sm font-black text-moss">Akurasi {getConfidenceLabel(result.confidence)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-black text-leaf-900">Panduan pengelolaan</h3>
        {typeof result.guide === 'object' && result.guide ? (
          <div className="mt-3">
            <ul className="list-inside list-disc space-y-2 text-sm leading-6 text-moss/70">
              {(Array.isArray(result.guide['panduan penanganan sampah']) ? result.guide['panduan penanganan sampah'] : [result.guide['panduan penanganan sampah']]).map((item, index) => (
                item ? <li key={index}>{item}</li> : null
              ))}
            </ul>
            {result.guide['Letakkan di kantong'] && (
              <p className="mt-4 text-sm font-bold text-moss">
                Letakkan di kantong: <span className="text-leaf-700">{result.guide['Letakkan di kantong']}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-moss/65">{result.guide}</p>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#f5f1df]/75 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">EcoPoints</p>
          <p className="mt-2 text-sm font-black text-leaf-900">+{result.points}</p>
        </div>
        <div className="rounded-2xl bg-[#f5f1df]/75 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">XP</p>
          <p className="mt-2 text-sm font-black text-leaf-900">+{result.xp}</p>
        </div>
      </div>

      <button className="mt-6 w-full rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900 sm:w-auto" type="button" onClick={onScanAgain}>
        Scan lagi
      </button>
    </section>
  )
}

function ScanPage() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraState, setCameraState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const hasCapturedImage = Boolean(previewUrl || result || isAnalyzing)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraState('idle')
  }

  useEffect(() => () => stopCamera(), [])

  useEffect(() => {
    if (cameraState !== 'ready' || !videoRef.current || !streamRef.current) return

    videoRef.current.srcObject = streamRef.current
    videoRef.current.play().catch(() => {
      setErrorMessage('Kamera sudah diizinkan, tetapi preview belum bisa diputar. Coba tutup lalu buka kamera lagi.')
    })
  }, [cameraState])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Browser ini belum mendukung akses kamera. Gunakan browser terbaru dan izinkan kamera dari pengaturan browser.')
      setCameraState('error')
      return
    }

    setErrorMessage('')
    setResult(null)
    setPreviewUrl('')
    setCameraState('requesting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      streamRef.current = stream
      setCameraState('ready')
    } catch {
      setCameraState('error')
      setErrorMessage('Kamera tidak bisa dibuka. Pastikan izin kamera diberikan, lalu coba buka kamera lagi.')
    }
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 960
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.88))
    stopCamera()
    setIsAnalyzing(true)
    setResult(null)
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsAnalyzing(false)
        setResult({ wasteName: 'Gambar gagal diproses', classification: 'Belum diklasifikasi', confidence: 0, points: 0, xp: 0, isValid: false, guide: 'Coba ambil gambar ulang.' })
        return
      }

      try {
        const response = await createScan(blob)
        const scan = response.data?.scan || response.data
        const recommendationData = response.data?.recommendation || scan.recommendation
        
        setResult({
          wasteName: scan.label,
          classification: scan.classification,
          confidence: scan.confidence,
          points: scan.ecoPoints,
          xp: scan.xpReward,
          isValid: scan.isValid,
          guide: recommendationData || 'Ikuti panduan penanganan sampah sesuai hasil klasifikasi.',
        })
      } catch (error) {
        setResult({ wasteName: 'Scan gagal', classification: 'Belum diklasifikasi', confidence: 0, points: 0, xp: 0, isValid: false, guide: error.message })
      } finally {
        setIsAnalyzing(false)
      }
    }, 'image/jpeg', 0.88)
  }

  const resetScan = () => {
    setPreviewUrl('')
    setResult(null)
    setIsAnalyzing(false)
    startCamera()
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      {hasCapturedImage ? (
        <ScanResult result={result} previewUrl={previewUrl} isLoading={isAnalyzing} onScanAgain={resetScan} />
      ) : (
        <CameraPanel videoRef={videoRef} canvasRef={canvasRef} cameraState={cameraState} errorMessage={errorMessage} onStart={startCamera} onCapture={captureImage} />
      )}
    </div>
  )
}

export default ScanPage

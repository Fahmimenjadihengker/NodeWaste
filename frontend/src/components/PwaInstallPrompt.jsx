import { useEffect, useState } from 'react'

const dismissKey = 'nodewaste_pwa_install_dismissed_at'

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}

function wasRecentlyDismissed() {
  const dismissedAt = Number(localStorage.getItem(dismissKey) || 0)
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  return dismissedAt && Date.now() - dismissedAt < sevenDays
}

function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIos] = useState(() => /iPhone|iPad|iPod/i.test(navigator.userAgent))

  useEffect(() => {
    if (!isMobileDevice() || isStandalone() || wasRecentlyDismissed()) return undefined

    if (isIos) {
      const timer = window.setTimeout(() => setIsVisible(true), 1200)
      return () => window.clearTimeout(timer)
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [isIos])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice.catch(() => null)
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, String(Date.now()))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-[1.5rem] border border-moss/10 bg-[#fff8e8] p-4 shadow-[0_22px_70px_rgba(32,58,37,0.22)] sm:hidden">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf-600 text-xl font-black text-white">N</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-leaf-700">Install aplikasi</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-leaf-900">Pasang NodeWaste di HP</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-moss/65">
            {isIos ? 'Buka tombol Share, lalu pilih Add to Home Screen.' : 'Akses lebih cepat seperti aplikasi tanpa buka browser dulu.'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!isIos && deferredPrompt ? (
          <button className="flex-1 rounded-full bg-leaf-600 px-4 py-3 text-sm font-black text-white" type="button" onClick={handleInstall}>
            Install
          </button>
        ) : null}
        <button className="flex-1 rounded-full border border-moss/15 px-4 py-3 text-sm font-black text-moss/70" type="button" onClick={handleDismiss}>
          Nanti saja
        </button>
      </div>
    </div>
  )
}

export default PwaInstallPrompt

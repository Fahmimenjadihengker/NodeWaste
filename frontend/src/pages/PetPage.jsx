import { useEffect, useMemo, useRef, useState } from 'react'
import AppCard from '../components/AppCard.jsx'
import LeafyAvatar from '../components/LeafyAvatar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { getPet, runPetAction } from '../services/authApi.js'
import { dashboardData } from '../services/dashboardData.js'

const petActions = [
  {
    id: 'feed',
    label: 'Makan',
    cost: 20,
    mood: 'happy',
    helper: 'Turunkan lapar dan bantu health pulih.',
    effect: { hunger: -28, health: 8 },
  },
  {
    id: 'play',
    label: 'Main',
    cost: 15,
    mood: 'excited',
    helper: 'Naikkan happiness dan tambah XP Leafy.',
    effect: { happiness: 18, hunger: 8, cleanliness: -4, xp: 15 },
  },
  {
    id: 'bath',
    label: 'Mandi',
    cost: 10,
    mood: 'fresh',
    helper: 'Bersihkan Leafy dan naikkan health.',
    effect: { cleanliness: 24, health: 6, happiness: 4 },
  },
]

const moodCopy = {
  happy: { label: 'Bahagia', message: 'Leafy terlihat nyaman dan siap menemanimu memilah sampah.' },
  excited: { label: 'Semangat', message: 'Leafy makin aktif setelah diajak bermain.' },
  fresh: { label: 'Segar', message: 'Leafy bersih dan terlihat lebih cerah.' },
  hungry: { label: 'Lapar', message: 'Leafy mulai lapar. Beri makan saat EcoPoints cukup.' },
  dirty: { label: 'Kotor', message: 'Leafy butuh mandi agar cleanliness kembali naik.' },
  sick: { label: 'Kurang sehat', message: 'Health Leafy rendah. Rawat pelan-pelan dengan makan atau mandi.' },
  lonely: { label: 'Butuh main', message: 'Ajak Leafy bermain agar happiness naik lagi.' },
}

function getPetMood(pet, fallbackMood) {
  if (pet.health < 40) return 'sick'
  if (pet.hunger > 70) return 'hungry'
  if (pet.cleanliness < 40) return 'dirty'
  if (pet.happiness < 40) return 'lonely'

  return fallbackMood
}

function StatusMeter({ label, value, helper }) {
  return (
    <div className="rounded-[1.25rem] bg-[#f8f4e6]/70 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-leaf-900">{label}</p>
          <p className="mt-1 text-xs font-bold text-moss/50">{helper}</p>
        </div>
        <span className="text-lg font-black text-leaf-900">{value}%</span>
      </div>
      <ProgressBar value={value} className="mt-4 h-2" />
    </div>
  )
}

function ActionCard({ action, disabled, onAction }) {
  return (
    <AppCard as="article" tone="softCream" className="p-5 shadow-[0_16px_42px_rgba(32,58,37,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Aksi</p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-leaf-900">{action.label}</h3>
        </div>
        <span className="rounded-full bg-[#edf4e6] px-3 py-1.5 text-xs font-black text-leaf-900">-{action.cost} EcoPoints</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-moss/65">{action.helper}</p>
      <button
        className="mt-5 w-full rounded-full bg-leaf-600 px-5 py-3 text-sm font-black text-white transition hover:bg-leaf-900 disabled:cursor-not-allowed disabled:bg-moss/20 disabled:text-moss/45"
        type="button"
        disabled={disabled}
        onClick={() => onAction(action)}
      >
        {disabled ? 'Poin belum cukup' : `Pakai ${action.label}`}
      </button>
    </AppCard>
  )
}

function ActivityLog({ items }) {
  return (
    <AppCard>
      <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Catatan perawatan</h2>
      <div className="mt-5 divide-y divide-moss/10">
        {items.map((item) => (
          <article key={`${item.title}-${item.time}`} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-leaf-900">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-moss/60">{item.meta}</p>
              </div>
              <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-moss/40">{item.time}</span>
            </div>
          </article>
        ))}
      </div>
    </AppCard>
  )
}

function PetPage() {
  const [ecoPoints, setEcoPoints] = useState(dashboardData.stats.ecoPoints)
  const [pet, setPet] = useState({ ...dashboardData.pet, xp: 45, nextLevelXp: 100 })
  const [lastMood, setLastMood] = useState('happy')
  const [avatarMood, setAvatarMood] = useState('idle')
  const [feedback, setFeedback] = useState('Leafy siap dirawat hari ini.')
  const clickTimesRef = useRef([])
  const moodTimerRef = useRef(null)
  const [logs, setLogs] = useState([
    { title: 'Leafy diberi makan', meta: '-20 EcoPoints', time: 'Kemarin' },
    { title: 'Leafy ikut progres scan', meta: '+10 XP dari aktivitas memilah', time: '2 hari lalu' },
  ])
  const mood = getPetMood(pet, lastMood)
  const moodInfo = moodCopy[mood]
  const satiety = 100 - pet.hunger
  const petXpProgress = Math.min(Math.round((pet.xp / pet.nextLevelXp) * 100), 100)

  const statusItems = useMemo(() => [
    { label: 'Health', value: pet.health, helper: 'Kondisi umum Leafy' },
    { label: 'Happiness', value: pet.happiness, helper: 'Naik saat diajak main' },
    { label: 'Kenyang', value: satiety, helper: 'Makin tinggi makin tidak lapar' },
    { label: 'Cleanliness', value: pet.cleanliness, helper: 'Naik saat Leafy mandi' },
  ], [pet, satiety])

  useEffect(() => {
    let isMounted = true

    getPet()
      .then((response) => {
        if (!isMounted) return

        setEcoPoints(response.data.ecoPoints)
        setPet(response.data.pet)
        setLogs(response.data.activities)
      })
      .catch(() => {})

    return () => {
      isMounted = false
      window.clearTimeout(moodTimerRef.current)
    }
  }, [])

  const handleLeafyClick = () => {
    const now = Date.now()
    clickTimesRef.current = [...clickTimesRef.current.filter((time) => now - time < 2000), now]
    const nextMood = clickTimesRef.current.length >= 5 ? 'angry' : 'happy'

    setAvatarMood(nextMood)
    setFeedback(nextMood === 'angry' ? 'Leafy kesal kalau diklik terlalu sering.' : 'Leafy suka diperhatikan, tapi jangan dispam ya.')
    window.clearTimeout(moodTimerRef.current)
    moodTimerRef.current = window.setTimeout(() => {
      clickTimesRef.current = []
      setAvatarMood('idle')
    }, nextMood === 'angry' ? 3000 : 1800)
  }

  const handleAction = async (action) => {
    if (ecoPoints < action.cost) {
      setFeedback(`EcoPoints belum cukup untuk ${action.label.toLowerCase()}.`)
      return
    }

    try {
      const response = await runPetAction(action.id)
      setEcoPoints(response.data.ecoPoints)
      setPet(response.data.pet)
      setLastMood(action.mood)
      setAvatarMood('happy')
      setFeedback(`${action.label} berhasil. Leafy ${moodCopy[action.mood].label.toLowerCase()}!`)
      setLogs((current) => [
        { title: `Leafy ${action.label.toLowerCase()}`, meta: `-${action.cost} EcoPoints`, time: 'Baru saja' },
        ...current.slice(0, 3),
      ])
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.5rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_22px_70px_rgba(32,58,37,0.13)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Virtual pet</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Rawat {pet.name}.</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-moss/70">Gunakan EcoPoints untuk menjaga Leafy tetap sehat, kenyang, bersih, dan bahagia.</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#fff8e8] px-4 py-2 text-sm font-black text-leaf-900">Lv. {pet.level}</span>
          </div>

          <div className="mt-8 rounded-[1.25rem] bg-[#f5f1df]/50 p-5 text-center">
            <LeafyAvatar mood={avatarMood} onClick={handleLeafyClick} />
            <div className="mx-auto mt-2 max-w-sm rounded-[1.25rem] bg-[#fff8e8]/80 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Mood</p>
              <h2 className="mt-1 text-2xl font-black text-leaf-900">{moodInfo.label}</h2>
              <p className="mt-2 text-sm leading-6 text-moss/65">{moodInfo.message}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <AppCard as="div" tone="softCream">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">EcoPoints</p>
            <p className="mt-2 text-4xl font-black text-leaf-900">{ecoPoints}</p>
            <p className="mt-2 text-sm font-semibold text-moss/60">Resource untuk perawatan Leafy.</p>
          </AppCard>
          <AppCard as="div">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Pet XP</p>
            <p className="mt-2 text-4xl font-black text-leaf-900">{pet.xp}/{pet.nextLevelXp}</p>
            <ProgressBar value={petXpProgress} className="mt-4 h-2" />
          </AppCard>
          <div className="sm:col-span-2 rounded-[1.25rem] border border-moss/10 bg-[#f8f4e6] p-5 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
            <p className="text-sm font-black text-leaf-900">{feedback}</p>
          </div>
          {statusItems.map((status) => (
            <StatusMeter key={status.label} {...status} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {petActions.map((action) => (
          <ActionCard key={action.id} action={action} disabled={ecoPoints < action.cost} onAction={handleAction} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <AppCard as="div" tone="yellow" className="self-start">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Panduan cepat</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Prioritas perawatan</h2>
          <div className="mt-5 space-y-3 text-sm font-semibold leading-6 text-moss/65">
            <p>Jika Kenyang rendah, pilih Makan terlebih dahulu.</p>
            <p>Jika Happiness rendah, ajak Leafy Main.</p>
            <p>Jika Cleanliness rendah, gunakan Mandi untuk menjaga health.</p>
          </div>
        </AppCard>
        <ActivityLog items={logs} />
      </section>
    </div>
  )
}

export default PetPage

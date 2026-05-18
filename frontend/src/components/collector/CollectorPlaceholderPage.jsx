import { Link } from 'react-router-dom'
import AppCard from '../AppCard.jsx'

function CollectorPlaceholderPage({ eyebrow, title, description, points = [] }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppCard tone="green" className="p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-moss/70">{description}</p>
        {points.length ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="rounded-[1rem] bg-white/65 p-4 text-sm font-bold leading-6 text-moss/70">
                {point}
              </div>
            ))}
          </div>
        ) : null}
        <Link className="mt-8 inline-flex rounded-full bg-leaf-700 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" to="/collector/dashboard">
          Kembali ke dashboard
        </Link>
      </AppCard>
    </div>
  )
}

export default CollectorPlaceholderPage

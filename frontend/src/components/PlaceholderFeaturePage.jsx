import AppPageHeader from './AppPageHeader.jsx'

function PlaceholderFeaturePage({ eyebrow, title, description, cards, action }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppPageHeader eyebrow={eyebrow} title={title} description={description} action={action} />

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[1.25rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">{card.label}</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-moss/65">{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default PlaceholderFeaturePage

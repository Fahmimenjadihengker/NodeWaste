function AppPageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="animate-fade-up rounded-[2rem] border border-moss/10 bg-[#e6edd8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  )
}

export default AppPageHeader

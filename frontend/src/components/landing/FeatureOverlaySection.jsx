import { forwardRef } from 'react'
import useActiveSectionIndex from '../../hooks/useActiveSectionIndex.js'

const FeatureRow = forwardRef(function FeatureRow({ feature, index, isActive }, ref) {
  return (
    <article ref={ref} className={`grid gap-4 border-t border-moss/15 px-5 py-7 transition-all duration-700 ease-out motion-reduce:transform-none md:grid-cols-[9rem_0.7fr_1fr] md:items-start ${isActive ? 'translate-x-0 scale-[1.01] rounded-[1.5rem] bg-[#fff8e8]/70 opacity-100 shadow-[0_18px_45px_rgba(32,58,37,0.06)]' : 'translate-x-0 opacity-55 md:translate-x-3'}`}>
      <span className={`text-sm font-black uppercase tracking-[0.22em] transition-colors duration-500 ${isActive ? 'text-leaf-700' : 'text-moss/40'}`}>0{index + 1}</span>
      <h3 className={`text-2xl font-black tracking-[-0.03em] transition-colors duration-500 ${isActive ? 'text-leaf-900' : 'text-moss/70'}`}>{feature.title}</h3>
      <div>
        <p className="max-w-2xl leading-7 text-moss/70">{feature.description}</p>
        <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <p className="mt-3 overflow-hidden text-sm font-semibold leading-6 text-leaf-900">{feature.detail}</p>
        </div>
      </div>
    </article>
  )
})

function FeatureOverlaySection({ features }) {
  const { activeIndex, setItemRef } = useActiveSectionIndex(features.length)

  return (
    <section id="fitur" className="relative z-10 min-h-screen rounded-t-[2rem] bg-[#f5f1df] px-5 py-20 shadow-[0_-32px_90px_rgba(32,58,37,0.12)] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col justify-center">
        <div className="grid gap-8 border-b border-moss/15 pb-10 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-600">Fitur inti</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.045em] text-leaf-900 sm:text-5xl">Dibuat untuk kebiasaan yang realistis.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-moss/70">
            NodeWaste tidak mencoba membuat semuanya terasa ramai. Fokusnya adalah memberi pemahaman, dorongan ringan, dan catatan progres yang cukup untuk membantu kamu lebih konsisten memilah sampah.
          </p>
        </div>

        <div>
          {features.map((feature, index) => (
            <FeatureRow key={feature.title} ref={setItemRef(index)} feature={feature} index={index} isActive={activeIndex === index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureOverlaySection

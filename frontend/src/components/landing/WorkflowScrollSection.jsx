import { forwardRef } from 'react'
import useActiveSectionIndex from '../../hooks/useActiveSectionIndex.js'

const WorkflowCard = forwardRef(function WorkflowCard({ step, index, isActive }, ref) {
  return (
    <article ref={ref} className={`border-t border-moss/15 py-6 transition-all duration-700 ease-out motion-reduce:transform-none ${isActive ? 'translate-x-0 scale-[1.01] opacity-100' : 'translate-x-0 opacity-55 lg:translate-x-3'}`}>
      <div className="grid gap-4 sm:grid-cols-[5rem_1fr] sm:items-start">
        <span className={`text-3xl font-black transition-colors duration-500 ${isActive ? 'text-leaf-700' : 'text-moss/45'}`}>{index + 1}</span>
        <div>
          <h3 className={`text-xl font-black leading-8 transition-colors duration-500 ${isActive ? 'text-leaf-900' : 'text-moss/70'}`}>{step.title}</h3>
          <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <p className="mt-4 overflow-hidden rounded-[1.25rem] bg-[#f8f4e6]/70 p-5 text-base font-semibold leading-7 text-moss/70 shadow-[0_18px_45px_rgba(32,58,37,0.06)]">{step.detail}</p>
          </div>
        </div>
      </div>
    </article>
  )
})

function WorkflowScrollSection({ steps }) {
  const { activeIndex, setItemRef } = useActiveSectionIndex(steps.length)

  return (
    <section id="cara-kerja" className="relative z-10 border-y border-moss/10 bg-[#e7edda] px-5 py-16 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-32">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Cara kerja</p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.045em] text-leaf-900 sm:text-5xl">Tiga langkah yang mudah diulang.</h2>
        </div>

        <div>
          {steps.map((step, index) => (
            <WorkflowCard key={step.title} ref={setItemRef(index)} step={step} index={index} isActive={activeIndex === index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkflowScrollSection

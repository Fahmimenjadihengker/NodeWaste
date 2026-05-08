import LeafyAvatar from './LeafyAvatar.jsx'
import LeafySpeechBubble from './LeafySpeechBubble.jsx'

function LeafyPreview() {
  return (
    <div id="leafy" className="relative min-h-[620px] scroll-mt-28 animate-fade-in pt-8 lg:min-h-[640px] lg:pt-0">
      <div className="absolute bottom-0 left-1/2 h-[520px] w-[min(320px,100%)] -translate-x-1/2 border-l border-r border-moss/15 sm:w-[380px] lg:h-[540px]">
        <div className="absolute bottom-0 left-1/2 h-[430px] w-px -translate-x-1/2 bg-moss/20" />
        <div className="absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-moss/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-[18rem] animate-fade-up border-l border-moss/20 pl-5 [animation-delay:120ms] [animation-fill-mode:both] lg:absolute lg:right-0 lg:top-8 lg:max-w-[15rem]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Leafy</p>
        <p className="mt-3 leading-7 text-moss/70">Kucing hijau chubby yang ikut tumbuh saat kamu konsisten memilah sampah.</p>
      </div>

      <div className="relative z-10 mx-auto mt-8 w-[310px] max-w-full animate-fade-up sm:w-[390px] lg:absolute lg:left-1/2 lg:top-52 lg:mt-0 lg:-translate-x-1/2" aria-label="Leafy, kucing hijau chubby">
        <div className="relative mx-auto h-[390px] w-[310px]">
          <LeafySpeechBubble className="absolute left-1/2 top-0 z-20 w-64 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-10" />
          <div className="absolute left-1/2 top-16 origin-top -translate-x-1/2 scale-[1.38] sm:scale-[1.52]">
            <LeafyAvatar />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-moss px-5 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#f5f1df]">
            Leafy
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeafyPreview

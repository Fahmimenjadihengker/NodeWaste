function LeafyAvatar({ compact = false, mood = 'idle', onClick }) {
  const isHappy = mood === 'happy'
  const isAngry = mood === 'angry'
  const animationClass = isAngry ? 'animate-leafy-shake' : isHappy ? 'animate-leafy-bounce' : 'animate-leafy-idle'
  const expressionLabel = isAngry ? 'Leafy sedang kesal karena spam klik' : isHappy ? 'Leafy senang' : 'Leafy, kucing hijau yang chubby'
  const headTopClass = compact ? 'top-3' : 'top-6'
  const earTopClass = compact ? '-top-2' : '-top-1'

  return (
    <button
      className={`relative mx-auto block ${compact ? 'h-40 w-40' : 'h-52 w-52'} ${onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-600/30' : 'cursor-default'}`}
      type="button"
      onClick={onClick}
      aria-label={expressionLabel}
      disabled={!onClick}
    >
      {(isHappy || isAngry) ? (
        <span className={`absolute right-0 top-1 z-10 rounded-full border border-moss/10 px-3 py-1.5 text-xs font-black shadow-[0_10px_24px_rgba(32,58,37,0.14)] animate-leafy-pop ${isAngry ? 'bg-honey text-moss' : 'bg-[#fff8e8] text-leaf-900'}`}>
          {isAngry ? 'Jangan spam aku!' : 'Yey!'}
        </span>
      ) : null}
      <div className={`absolute inset-0 ${animationClass}`}>
        <div className="absolute bottom-1 left-1/2 h-7 w-36 -translate-x-1/2 rounded-full bg-moss/10" />
        <div className={`absolute left-1/2 h-[7.3rem] w-36 -translate-x-1/2 rounded-[48%_48%_36%_36%] bg-leaf-600 ${compact ? 'bottom-0' : 'bottom-5'}`} />
        <div className="absolute bottom-[5.15rem] left-[1.95rem] h-14 w-8 -rotate-[18deg] rounded-full bg-leaf-700" />
        <div className="absolute bottom-[5.15rem] right-[1.95rem] h-14 w-8 rotate-[18deg] rounded-full bg-leaf-700" />
        <div className="absolute bottom-3 left-[2.05rem] h-12 w-10 -rotate-6 rounded-[52%_52%_48%_48%] bg-[#f5f1df]">
          <div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-moss/25" />
          <div className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-moss/25" />
          <div className="absolute bottom-2 right-2 h-1 w-1 rounded-full bg-moss/25" />
        </div>
        <div className="absolute bottom-3 right-[2.05rem] h-12 w-10 rotate-6 rounded-[52%_52%_48%_48%] bg-[#f5f1df]">
          <div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-moss/25" />
          <div className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-moss/25" />
          <div className="absolute bottom-2 right-2 h-1 w-1 rounded-full bg-moss/25" />
        </div>
        <div className={`absolute left-[3.1rem] ${earTopClass} z-10 h-12 w-9 bg-[#b6ca8e] [clip-path:polygon(50%_0,100%_100%,0_100%)] ${isAngry ? '-translate-y-1 rotate-[-24deg]' : 'animate-leafy-ear-left'}`}>
          <div className="absolute bottom-2 left-1/2 h-6 w-5 -translate-x-1/2 bg-[#f3a28f] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        </div>
        <div className={`absolute right-[3.1rem] ${earTopClass} z-10 h-12 w-9 bg-[#b6ca8e] [clip-path:polygon(50%_0,100%_100%,0_100%)] ${isAngry ? '-translate-y-1 rotate-[24deg]' : 'animate-leafy-ear-right'}`}>
          <div className="absolute bottom-2 left-1/2 h-6 w-5 -translate-x-1/2 bg-[#f3a28f] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        </div>
        <div className={`absolute left-1/2 ${headTopClass} z-20 h-32 w-44 -translate-x-1/2 rounded-[47%_47%_52%_52%] bg-leaf-500`}>
          {isAngry ? (
            <>
              <div className="absolute left-5 top-7 h-1.5 w-12 rotate-[12deg] rounded-full bg-moss" />
              <div className="absolute right-7 top-8 h-1.5 w-7 rotate-[-20deg] rounded-full bg-moss" />
            </>
          ) : null}
          <div className={`absolute left-10 top-11 rounded-full bg-moss ${isHappy ? 'h-5 w-5' : 'h-4 w-4'} ${isAngry ? '' : 'animate-leafy-blink'}`}>
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dce8cf]" />
          </div>
          <div className={`absolute right-10 top-11 rounded-full bg-moss ${isHappy ? 'h-5 w-5' : 'h-4 w-4'} ${isAngry ? '' : 'animate-leafy-blink'}`}>
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dce8cf]" />
          </div>
          <div className="absolute left-1/2 top-[4.15rem] h-9 w-16 -translate-x-1/2 rounded-[48%_48%_58%_58%] bg-[#f5f1df]" />
          <div className="absolute left-[4.1rem] top-[4.6rem] h-5 w-6 rounded-full bg-[#f5f1df]" />
          <div className="absolute right-[4.1rem] top-[4.6rem] h-5 w-6 rounded-full bg-[#f5f1df]" />
          <div className="absolute left-1/2 top-[4.45rem] h-3 w-4 -translate-x-1/2 rounded-[55%_55%_45%_45%] bg-[#e98172]" />
          <div className={`absolute left-1/2 top-[5.1rem] -translate-x-1/2 bg-moss ${isAngry ? 'h-1 w-7 rounded-full' : isHappy ? 'h-4 w-7 rounded-b-full' : 'h-3 w-6 rounded-b-full'}`} />
          <div className="absolute left-[1.35rem] top-[5.2rem] h-px w-14 rotate-[10deg] bg-moss/65" />
          <div className="absolute left-[1.45rem] top-[5.65rem] h-px w-14 bg-moss/65" />
          <div className="absolute left-[1.35rem] top-[6.1rem] h-px w-14 -rotate-[10deg] bg-moss/65" />
          <div className="absolute right-[1.35rem] top-[5.2rem] h-px w-14 -rotate-[10deg] bg-moss/65" />
          <div className="absolute right-[1.45rem] top-[5.65rem] h-px w-14 bg-moss/65" />
          <div className="absolute right-[1.35rem] top-[6.1rem] h-px w-14 rotate-[10deg] bg-moss/65" />
        </div>
      </div>
    </button>
  )
}

export default LeafyAvatar

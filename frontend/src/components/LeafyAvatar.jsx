function LeafyAvatar({ compact = false, mood = 'idle', onClick }) {
  const isHappy = mood === 'happy'
  const isAngry = mood === 'angry'
  const animationClass = isAngry ? 'animate-leafy-shake' : isHappy ? 'animate-leafy-bounce' : ''
  const expressionLabel = isAngry ? 'Leafy sedang kesal karena spam klik' : isHappy ? 'Leafy senang' : 'Leafy, kucing hijau bajak laut'

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
        <div className="absolute bottom-2 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-moss/10" />
        <div className="absolute bottom-8 left-1/2 h-24 w-28 -translate-x-1/2 rounded-[52%_52%_44%_44%] bg-leaf-600" />
        <div className="absolute bottom-4 left-[2.8rem] h-12 w-6 rounded-full bg-[#f5f1df]" />
        <div className="absolute bottom-4 right-[2.8rem] h-12 w-6 rounded-full bg-[#f5f1df]" />
        <div className="absolute bottom-8 right-1 h-16 w-8 rotate-[22deg] rounded-full border-r-[12px] border-leaf-700" />
        <div className={`absolute left-0 top-20 h-16 w-7 origin-bottom -rotate-[18deg] rounded-full bg-leaf-700 ${isAngry ? '' : 'animate-[wave_1.4s_ease-in-out_infinite]'}`} />
        <div className={`absolute -left-3 top-16 h-10 w-10 rounded-full bg-leaf-500 ${isAngry ? '' : 'animate-[wave_1.4s_ease-in-out_infinite]'}`} />
        <div className="absolute left-1/2 top-7 h-28 w-36 -translate-x-1/2 rounded-[46%_46%_52%_52%] bg-leaf-500">
          <div className={`absolute -left-1 -top-8 h-16 w-16 rotate-[-22deg] bg-leaf-700 [clip-path:polygon(50%_0,100%_100%,0_100%)] ${isAngry ? '-translate-y-1' : ''}`} />
          <div className="absolute left-4 -top-3 h-8 w-8 rotate-[-22deg] bg-[#b6ca8e] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <div className={`absolute -right-1 -top-8 h-16 w-16 rotate-[22deg] bg-leaf-700 [clip-path:polygon(50%_0,100%_100%,0_100%)] ${isAngry ? '-translate-y-1' : ''}`} />
          <div className="absolute right-4 -top-3 h-8 w-8 rotate-[22deg] bg-[#b6ca8e] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          {isAngry ? (
            <>
              <div className="absolute left-5 top-7 h-1.5 w-12 rotate-[12deg] rounded-full bg-honey" />
              <div className="absolute right-7 top-8 h-1.5 w-7 rotate-[-20deg] rounded-full bg-moss" />
            </>
          ) : null}
          <div className="absolute left-5 top-8 h-9 w-14 rotate-[-8deg] rounded-full bg-moss" />
          <div className="absolute left-0 top-[2.75rem] h-1.5 w-20 rotate-[13deg] rounded-full bg-moss" />
          <div className={`absolute right-8 top-11 rounded-full bg-moss ${isHappy ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <div className="absolute right-[2.2rem] top-[2.95rem] h-1.5 w-1.5 rounded-full bg-[#dce8cf]" />
          <div className="absolute left-1/2 top-[4rem] h-3 w-4 -translate-x-1/2 rounded-full bg-moss" />
          <div className={`absolute left-1/2 top-[4.5rem] -translate-x-1/2 bg-[#f5f1df] ${isAngry ? 'h-2 w-7 rounded-t-full' : isHappy ? 'h-5 w-7 rounded-b-full' : 'h-4 w-5 rounded-b-full'}`} />
          <div className="absolute left-[2.6rem] top-[5.2rem] h-px w-10 -rotate-6 bg-moss/70" />
          <div className="absolute right-[2.6rem] top-[5.2rem] h-px w-10 rotate-6 bg-moss/70" />
          <div className="absolute left-[2.4rem] top-[5.9rem] h-px w-12 rotate-6 bg-moss/70" />
          <div className="absolute right-[2.4rem] top-[5.9rem] h-px w-12 -rotate-6 bg-moss/70" />
        </div>
        <div className={`absolute left-1/2 top-[7.8rem] -translate-x-1/2 ${isAngry ? 'h-4 w-12 rounded-t-full border-t-4 border-moss' : 'h-5 w-12 rounded-b-full border-b-4 border-moss'}`} />
      </div>
    </button>
  )
}

export default LeafyAvatar

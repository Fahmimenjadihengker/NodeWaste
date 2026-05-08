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
        <div className="absolute bottom-2 left-[2.25rem] h-9 w-16 -rotate-2 rounded-[52%_52%_42%_42%] bg-[#f5f1df] shadow-[inset_0_-3px_0_rgba(32,58,37,0.06)]" />
        <div className="absolute bottom-2 right-[2.25rem] h-9 w-16 rotate-2 rounded-[52%_52%_42%_42%] bg-[#f5f1df] shadow-[inset_0_-3px_0_rgba(32,58,37,0.06)]" />
        <div className={`absolute left-[2.8rem] ${earTopClass} z-10 h-12 w-9 bg-[#b6ca8e] [clip-path:polygon(0_0,100%_100%,0_82%)] ${isAngry ? '-translate-y-1 rotate-[-14deg]' : 'animate-leafy-ear-left'}`} />
        <div className={`absolute right-[2.8rem] ${earTopClass} z-10 h-12 w-9 bg-[#b6ca8e] [clip-path:polygon(100%_0,100%_82%,0_100%)] ${isAngry ? '-translate-y-1 rotate-[14deg]' : 'animate-leafy-ear-right'}`} />
        <div className={`absolute left-1/2 ${headTopClass} z-20 h-32 w-44 -translate-x-1/2 rounded-[52%_52%_50%_50%] bg-leaf-500`}>
          <div className={`absolute left-9 top-8 h-1.5 rounded-full bg-moss ${isAngry ? 'w-10 rotate-[16deg]' : 'w-8 -rotate-[8deg]'}`} />
          <div className={`absolute right-9 top-8 h-1.5 rounded-full bg-moss ${isAngry ? 'w-10 rotate-[-16deg]' : 'w-8 rotate-[8deg]'}`} />
          <div className={`absolute left-10 top-11 rounded-full bg-moss ${isHappy ? 'h-5 w-5' : 'h-4 w-4'} ${isAngry ? '' : 'animate-leafy-blink'}`}>
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dce8cf]" />
          </div>
          <div className={`absolute right-10 top-11 rounded-full bg-moss ${isHappy ? 'h-5 w-5' : 'h-4 w-4'} ${isAngry ? '' : 'animate-leafy-blink'}`}>
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dce8cf]" />
          </div>
          <div className="absolute left-1/2 top-[4.15rem] h-9 w-16 -translate-x-1/2 rounded-[48%_48%_58%_58%] bg-[#f5f1df]" />
          <div className="absolute left-[4.1rem] top-[4.6rem] h-5 w-6 rounded-full bg-[#f5f1df]" />
          <div className="absolute right-[4.1rem] top-[4.6rem] h-5 w-6 rounded-full bg-[#f5f1df]" />
          {!isHappy ? <div className="absolute left-1/2 top-[4.78rem] h-3 w-0.5 -translate-x-1/2 rounded-full bg-moss/75" /> : null}
          {isAngry ? (
            <div className="absolute left-1/2 top-[5.18rem] h-4 w-8 -translate-x-1/2 rounded-t-full border-t-2 border-moss" />
          ) : isHappy ? (
            <div className="absolute left-1/2 top-[5.1rem] h-5 w-4 -translate-x-1/2 rounded-b-full bg-[#e98172]" />
          ) : (
            <>
              <div className="absolute left-[4.55rem] top-[4.95rem] h-4 w-4 rounded-b-full border-b-2 border-r-2 border-moss" />
              <div className="absolute right-[4.55rem] top-[4.95rem] h-4 w-4 rounded-b-full border-b-2 border-l-2 border-moss" />
            </>
          )}
          <div className="absolute left-[0.95rem] top-[4.65rem] h-px w-14 rotate-[10deg] bg-moss/65" />
          <div className="absolute left-[1.05rem] top-[5.15rem] h-px w-14 bg-moss/65" />
          <div className="absolute left-[0.95rem] top-[5.65rem] h-px w-14 -rotate-[10deg] bg-moss/65" />
          <div className="absolute right-[0.95rem] top-[4.65rem] h-px w-14 -rotate-[10deg] bg-moss/65" />
          <div className="absolute right-[1.05rem] top-[5.15rem] h-px w-14 bg-moss/65" />
          <div className="absolute right-[0.95rem] top-[5.65rem] h-px w-14 rotate-[10deg] bg-moss/65" />
        </div>
      </div>
    </button>
  )
}

export default LeafyAvatar

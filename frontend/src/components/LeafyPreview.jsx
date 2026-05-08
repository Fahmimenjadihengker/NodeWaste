function LeafyPreview() {
  return (
    <div className="relative min-h-[620px] animate-fade-in pt-8 lg:min-h-[640px] lg:pt-0">
      <div className="absolute bottom-0 left-1/2 h-[520px] w-[min(320px,100%)] -translate-x-1/2 border-l border-r border-moss/15 sm:w-[380px] lg:h-[540px]">
        <div className="absolute bottom-0 left-1/2 h-[430px] w-px -translate-x-1/2 bg-moss/20" />
        <div className="absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-moss/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-[18rem] animate-fade-up border-l border-moss/20 pl-5 [animation-delay:120ms] [animation-fill-mode:both] lg:absolute lg:right-0 lg:top-8 lg:max-w-[15rem]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Leafy</p>
        <p className="mt-3 leading-7 text-moss/70">Kucing hijau kecil bermata bajak laut yang ikut tumbuh saat kamu konsisten memilah sampah.</p>
      </div>

      <div className="relative z-10 mx-auto mt-8 w-[310px] max-w-full animate-fade-up sm:w-[390px] lg:absolute lg:left-1/2 lg:top-52 lg:mt-0 lg:-translate-x-1/2" aria-label="Leafy, kucing hijau bajak laut yang melambaikan tangan">
        <div className="relative mx-auto h-[390px] w-[310px] animate-leafy-idle">
          <div className="absolute bottom-8 left-1/2 h-11 w-48 -translate-x-1/2 rounded-full bg-moss/10" />

          <div className="absolute bottom-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-[58%_58%_42%_42%] bg-leaf-600" />
          <div className="absolute bottom-12 left-[78px] h-28 w-11 -rotate-6 rounded-[45%_45%_55%_55%] bg-leaf-700" />
          <div className="absolute bottom-12 right-[78px] h-28 w-11 rotate-6 rounded-[45%_45%_55%_55%] bg-leaf-700" />
          <div className="absolute bottom-[70px] left-[82px] h-9 w-12 rounded-full bg-[#f5f1df]" />
          <div className="absolute bottom-[70px] right-[82px] h-9 w-12 rounded-full bg-[#f5f1df]" />

          <div className="absolute bottom-16 left-[232px] h-28 w-16 origin-bottom rounded-full border-r-[20px] border-leaf-700 animate-leafy-tail-sway" />
          <div className="absolute bottom-28 left-[255px] h-16 w-8 rotate-[18deg] rounded-full bg-[#f5f1df]" />

          <div className="absolute left-[38px] top-[146px] h-28 w-11 rounded-full bg-leaf-700 animate-leafy-paw-wave" />
          <div className="absolute left-[18px] top-[120px] h-16 w-16 rounded-[48%_52%_58%_42%] bg-leaf-500 animate-leafy-paw-wave" />
          <div className="absolute left-[30px] top-[130px] h-4 w-4 rounded-full bg-[#f5f1df]" />

          <div className="absolute left-1/2 top-20 h-44 w-52 -translate-x-1/2 rounded-[46%_46%_52%_52%] bg-leaf-500">
            <div className="absolute -left-1 -top-[3.25rem] h-24 w-24 bg-leaf-700 [clip-path:polygon(50%_0,100%_100%,0_100%)] animate-leafy-ear-left" />
            <div className="absolute left-5 -top-6 h-12 w-12 rotate-[-24deg] bg-[#b6ca8e] [clip-path:polygon(50%_8%,88%_100%,12%_100%)]" />
            <div className="absolute -right-1 -top-[3.25rem] h-24 w-24 bg-leaf-700 [clip-path:polygon(50%_0,100%_100%,0_100%)] animate-leafy-ear-right" />
            <div className="absolute right-5 -top-6 h-12 w-12 rotate-[24deg] bg-[#b6ca8e] [clip-path:polygon(50%_8%,88%_100%,12%_100%)]" />
            <div className="absolute left-7 top-12 h-14 w-20 rotate-[-8deg] rounded-full bg-moss" />
            <div className="absolute left-1 top-[67px] h-2 w-[120px] rotate-[13deg] rounded-full bg-moss" />
            <div className="absolute right-12 top-[66px] h-5 w-5 rounded-full bg-moss animate-leafy-blink" />
            <div className="absolute right-[53px] top-[70px] h-2 w-2 rounded-full bg-[#dce8cf]" />
            <div className="absolute left-1/2 top-[88px] h-9 w-12 -translate-x-1/2 rounded-[55%_55%_48%_48%] bg-[#f5f1df]" />
            <div className="absolute left-1/2 top-[99px] h-5 w-6 -translate-x-1/2 rounded-b-full bg-moss" />
            <div className="absolute left-1/2 top-[88px] h-3 w-4 -translate-x-1/2 rounded-full bg-moss" />
            <div className="absolute left-[58px] top-[116px] h-px w-16 bg-moss/70 animate-whisker-left-up" />
            <div className="absolute right-[58px] top-[116px] h-px w-16 bg-moss/70 animate-whisker-right-up" />
            <div className="absolute left-[54px] top-[132px] h-px w-[72px] bg-moss/70 animate-whisker-left-down" />
            <div className="absolute right-[54px] top-[132px] h-px w-[72px] bg-moss/70 animate-whisker-right-down" />
          </div>

          <div className="absolute left-[122px] top-[186px] h-8 w-16 rounded-b-full border-b-4 border-moss" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-moss px-5 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#f5f1df]">
            Leafy
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeafyPreview

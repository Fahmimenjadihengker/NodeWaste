const toneClass = {
  cream: 'border-[#e3d8bb] bg-[#f8f4e6]',
  softCream: 'border-moss/10 bg-[#fff8e8]',
  green: 'border-leaf-600/15 bg-[#edf4e6]',
  leaf: 'border-moss/10 bg-[#dce8cf]',
  yellow: 'border-[#ead79e] bg-[#fff3cf]',
}

function AppCard({ as: Component = 'section', tone = 'cream', className = '', children, ...props }) {
  return (
    <Component
      className={`rounded-[1.25rem] border p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)] ${toneClass[tone] || toneClass.cream} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default AppCard

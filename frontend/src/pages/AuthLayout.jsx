import { Link } from 'react-router-dom'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1df] px-5 py-10 text-moss sm:px-8">
      <div className="w-full max-w-md animate-fade-up">
        <section className="rounded-[1.25rem] border border-moss/10 bg-white px-6 py-8 text-center shadow-[0_28px_80px_rgba(32,58,37,0.18)] sm:px-8 sm:py-10">
          <Link to="/" className="inline-flex text-4xl font-black leading-tight tracking-[-0.045em] text-leaf-900 transition hover:text-leaf-700 sm:text-5xl">
            {title}
          </Link>
          <p className="mx-auto mt-3 max-w-sm text-base font-black uppercase tracking-[0.22em] text-leaf-700">{subtitle}</p>
          <div className="mt-8 text-left">{children}</div>
        </section>

        <p className="mt-6 text-center text-sm font-semibold text-moss/65">{footer}</p>
      </div>
    </main>
  )
}

export default AuthLayout

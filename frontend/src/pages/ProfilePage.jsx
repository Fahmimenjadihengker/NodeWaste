import { useOutletContext } from 'react-router-dom'
import AppPageHeader from '../components/AppPageHeader.jsx'

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'E').toUpperCase()
}

function ProfilePage() {
  const { user, onLogout } = useOutletContext()

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppPageHeader
        eyebrow="Profile"
        title="Profil pengguna."
        description="Kelola identitas akun, progres hijau, dan akses logout untuk pengalaman mobile PWA."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_20px_60px_rgba(32,58,37,0.12)]">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-leaf-600 text-2xl font-black text-white shadow-[0_14px_28px_rgba(52,122,55,0.24)]">
              {getInitial(user?.name)}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">{user?.name || 'Eco Hero'}</h2>
              <p className="mt-1 text-sm font-semibold text-moss/60">{user?.email || 'Email belum tersedia'}</p>
            </div>
          </div>

          <button className="mt-8 w-full rounded-full border border-moss/20 px-5 py-3 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="rounded-[2rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Berikutnya</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Achievement dan statistik personal</h2>
          <p className="mt-3 text-sm leading-6 text-moss/65">
            Area ini akan menampilkan achievement, total kontribusi, preferensi akun, dan pengaturan lain ketika endpoint profile tersedia.
          </p>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage

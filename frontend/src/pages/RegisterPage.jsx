import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { registerUser, saveAuthSession } from '../services/authApi.js'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await registerUser(form)
      saveAuthSession(response.data)
      navigate('/dashboard')
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="NodeWaste"
      subtitle="Daftar"
      footer={<>Sudah punya akun? <Link className="font-black text-leaf-700" to="/login">Masuk</Link></>}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-black text-moss">Nama</span>
          <input className="mt-2 w-full rounded-2xl border border-moss/15 bg-white px-4 py-3 font-semibold outline-none transition placeholder:text-moss/35 focus:border-leaf-600" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Nama kamu" required />
        </label>
        <label className="block">
          <span className="text-sm font-black text-moss">Email</span>
          <input className="mt-2 w-full rounded-2xl border border-moss/15 bg-white px-4 py-3 font-semibold outline-none transition placeholder:text-moss/35 focus:border-leaf-600" name="email" type="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" required />
        </label>
        <label className="block">
          <span className="text-sm font-black text-moss">Password</span>
          <input className="mt-2 w-full rounded-2xl border border-moss/15 bg-white px-4 py-3 font-semibold outline-none transition placeholder:text-moss/35 focus:border-leaf-600" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" minLength={8} required />
        </label>
        {status.message ? (
          <p className={`border-l px-4 py-3 text-sm font-bold ${status.type === 'success' ? 'border-leaf-600 bg-[#e7edda] text-leaf-700' : 'border-red-600 bg-red-50 text-red-700'}`}>{status.message}</p>
        ) : null}
        <button className="w-full rounded-full bg-leaf-600 px-5 py-3.5 font-black text-white transition hover:bg-leaf-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Mendaftarkan...' : 'Daftar Gratis'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage

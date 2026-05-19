import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthField from '../components/AuthField.jsx'
import FeedbackMessage from '../components/FeedbackMessage.jsx'
import AuthLayout from './AuthLayout.jsx'
import { getRoleHomePath, loginUser, prefetchRoleData, saveAuthSession } from '../services/authApi.js'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
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
      const response = await loginUser(form)
      saveAuthSession(response.data)
      prefetchRoleData(response.data.user)
      navigate(getRoleHomePath(response.data.user))
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="NodeWaste"
      subtitle="Masuk"
      footer={<>Belum punya akun? <Link className="font-black text-leaf-700" to="/register">Daftar sekarang</Link></>}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Email" name="email" placeholder="nama@email.com" type="email" value={form.email} onChange={handleChange} />
        <AuthField label="Password" name="password" placeholder="Minimal 8 karakter" type="password" value={form.password} onChange={handleChange} />
        <FeedbackMessage message={status.message} type={status.type} />
        <button className="w-full rounded-full bg-leaf-600 px-5 py-3.5 font-black text-white transition hover:bg-leaf-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage

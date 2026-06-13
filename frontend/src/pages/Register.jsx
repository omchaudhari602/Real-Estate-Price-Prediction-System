import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/api/v1/auth/register', data)
      toast.success('Registered successfully')
      window.location.href = '/login'
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_#eff6ff_0%,_#f8fafc_40%,_#ffffff_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white/80 shadow-2xl ring-1 ring-white/70 backdrop-blur-xl p-8 sm:p-10 animate-[fadeIn_.4s_ease-out]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">HousePrice</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">Create account</h2>
        <p className="mt-2 text-sm text-gray-500">Register to access dashboard, predictions, and monitoring tools.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Full name" {...register('full_name', { required: true })} />
          <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Email" {...register('email', { required: true })} />
          <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Password" type="password" {...register('password', { required: true })} />
          <button className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            {loading ? <span className="animate-pulse">Creating account...</span> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

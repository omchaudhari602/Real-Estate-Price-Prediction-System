import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Logged in')
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      const msg = err?.response?.data?.detail || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_#eff6ff_0%,_#f8fafc_40%,_#ffffff_100%)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white/75 shadow-2xl ring-1 ring-white/70 backdrop-blur-xl grid lg:grid-cols-2 animate-[fadeIn_.4s_ease-out]">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 via-cyan-600 to-sky-500 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
              Smart analytics for real estate
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-tight">Welcome back to HousePrice</h1>
            <p className="mt-4 max-w-md text-white/85 text-lg">
              Predict, monitor, and manage your house price models from a polished dashboard built for speed.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-white/70">FastAPI</p>
              <p className="mt-1 font-semibold">Backend ready</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-white/70">MLflow</p>
              <p className="mt-1 font-semibold">Tracking enabled</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-white/70">UI</p>
              <p className="mt-1 font-semibold">Animated experience</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">HousePrice</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to access predictions, analytics, and monitoring.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register('email', { required: true })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-24 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? <span className="animate-pulse">Logging in...</span> : 'Login'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-900">
            <p className="font-semibold">Demo login</p>
            <p className="mt-1">Email: <span className="font-mono">admin@example.com</span></p>
            <p>Password: <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

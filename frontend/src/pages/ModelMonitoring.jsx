import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ModelMonitoring() {
  const [models, setModels] = useState([])
  const [history, setHistory] = useState(null)
  const [activeModel, setActiveModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('accuracy') // 'accuracy' or 'errors'

  const fetchData = async () => {
    try {
      const [modelsRes, historyRes] = await Promise.all([
        api.get('/api/v1/models'),
        api.get('/api/v1/history')
      ])
      
      setModels(modelsRes.data.models || [])
      setHistory(historyRes.data || null)
      if (historyRes.data && historyRes.data.best) {
        setActiveModel(historyRes.data.best)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load model monitoring data.')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleActivate = async (modelName) => {
    setLoading(true)
    try {
      const cleanName = modelName.endsWith('.joblib') ? modelName.slice(0, -7) : modelName
      const res = await api.post('/api/v1/models/active', { model_name: cleanName })
      if (res.data && res.data.status === 'success') {
        setActiveModel(cleanName)
        toast.success(`${cleanName} activated successfully!`)
        fetchData()
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to activate model.')
    } finally {
      setLoading(false)
    }
  }

  // Format data for Recharts
  const getChartData = () => {
    if (!history || !history.results) return []
    return Object.entries(history.results).map(([name, metrics]) => ({
      name,
      'R² Accuracy (%)': parseFloat((metrics.r2 * 100).toFixed(2)),
      'MAE': parseFloat(metrics.mae.toFixed(2)),
      'RMSE': parseFloat(metrics.rmse.toFixed(2)),
    }))
  }

  const chartData = getChartData()
  const activeMetrics = history && history.results ? history.results[activeModel] : null

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Model Monitoring</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare training performance across regression models and dynamically select the active prediction model.
        </p>
      </div>

      {/* Active Model Showcase */}
      {activeModel && activeMetrics && (
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
          {/* Decorative background shape */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
            <svg width="300" height="300" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" />
            </svg>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-100 border border-blue-400/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Live Model
              </span>
              <h2 className="text-2xl font-bold mb-1">{activeModel}</h2>
              <p className="text-blue-100/80 text-sm">Currently powering the price prediction engine</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-6 md:mt-0 text-center border-t border-white/10 pt-4 md:pt-0 md:border-t-0">
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">R² Score</p>
                <p className="text-2xl font-extrabold">{(activeMetrics.r2 * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">MAE</p>
                <p className="text-2xl font-extrabold">₹{activeMetrics.mae.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">RMSE</p>
                <p className="text-2xl font-extrabold">₹{activeMetrics.rmse.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tabs and Charts */}
      {chartData.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-150 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-150 dark:border-gray-700 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Performance Benchmarks</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('accuracy')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'accuracy'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Accuracy (R²)
              </button>
              <button
                onClick={() => setActiveTab('errors')}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'errors'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Prediction Errors (MAE / RMSE)
              </button>
            </div>
          </div>
          
          <div className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'accuracy' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[90, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                  <Legend />
                  <Bar dataKey="R² Accuracy (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Error']} />
                  <Legend />
                  <Bar dataKey="MAE" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Model List */}
      <div>
        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Available Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((modelFile) => {
            const cleanName = modelFile.endsWith('.joblib') ? modelFile.slice(0, -7) : modelFile
            const isModelTrained = history && history.results && history.results[cleanName]
            const metrics = isModelTrained ? history.results[cleanName] : null
            const isActive = activeModel === cleanName

            return (
              <div
                key={modelFile}
                className={`bg-white dark:bg-gray-800 rounded-xl p-5 border shadow-sm transition duration-200 ${
                  isActive
                    ? 'border-blue-500 ring-1 ring-blue-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{cleanName}</h4>
                    <p className="text-gray-500 text-xs dark:text-gray-400">{modelFile}</p>
                  </div>
                  {isActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/20">
                      Active
                    </span>
                  )}
                </div>

                {metrics ? (
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-gray-700 text-center mb-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">R² Score</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{(metrics.r2 * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">MAE</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{metrics.mae.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">RMSE</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{metrics.rmse.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center border-t border-b border-gray-100 dark:border-gray-700 text-gray-400 text-xs mb-4">
                    No metrics details available.
                  </div>
                )}

                <button
                  onClick={() => handleActivate(cleanName)}
                  disabled={isActive || loading}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-250 dark:border-gray-600'
                      : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {isActive ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Currently Active
                    </>
                  ) : (
                    'Activate Model'
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

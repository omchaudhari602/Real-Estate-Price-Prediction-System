import React, { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const performanceData = [
  { month: 'Jan', accuracy: 92, predictions: 240, revenue: 24000 },
  { month: 'Feb', accuracy: 94, predictions: 221, revenue: 22100 },
  { month: 'Mar', accuracy: 93, predictions: 229, revenue: 20000 },
  { month: 'Apr', accuracy: 95, predictions: 200, revenue: 22800 },
  { month: 'May', accuracy: 96, predictions: 209, revenue: 25000 },
  { month: 'Jun', accuracy: 97, predictions: 290, revenue: 27900 },
]

const recentPredictions = [
  { id: 1, property: '3 BHK, Mumbai', predicted: '₹52L', actual: '₹51.5L', accuracy: '98%' },
  { id: 2, property: '2 BHK, Delhi', predicted: '₹38L', actual: '₹38.2L', accuracy: '99%' },
  { id: 3, property: '4 BHK, Bangalore', predicted: '₹65L', actual: '₹64.8L', accuracy: '99%' },
]

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium mb-2">{label}</p>
        <h3 className="text-3xl font-bold mb-2">{value}</h3>
        <p className="text-sm text-green-200">↑ {change} this month</p>
      </div>
      <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [activeChart, setActiveChart] = useState('accuracy')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your property price prediction performance</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated: Today</p>
            <p className="text-2xl font-bold text-green-600">✓ All systems running</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={() => <span className="text-2xl">📊</span>}
            label="Total Predictions"
            value="1,289"
            change="12%"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={() => <span className="text-2xl">🎯</span>}
            label="Avg Accuracy"
            value="95%"
            change="3%"
            color="from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={() => <span className="text-2xl">💰</span>}
            label="Revenue"
            value="₹24.2L"
            change="8%"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={() => <span className="text-2xl">⚡</span>}
            label="Performance"
            value="99%"
            change="5%"
            color="from-orange-500 to-orange-600"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Large Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Performance Trends</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last 6 months overview</p>
            </div>
            <div className="flex gap-2">
              {['accuracy', 'predictions'].map((chart) => (
                <button
                  key={chart}
                  onClick={() => setActiveChart(chart)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeChart === chart
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {chart === 'accuracy' ? 'Accuracy' : 'Predictions'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'accuracy' ? (
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => `${value}%`}
                  />
                  <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              ) : (
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="predictions" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-indigo-100 mb-4">Model Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Model</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">XGBoost</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Latency</span>
                <span className="text-green-300 font-bold">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-green-300 font-bold">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-cyan-100 mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Today</span>
                <span className="font-bold">124 predictions</span>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="font-bold">892 predictions</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Error</span>
                <span className="font-bold">2.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Predictions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your latest property valuations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Predicted Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actual Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map((pred, idx) => (
                <tr
                  key={pred.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 font-medium">{pred.property}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">{pred.predicted}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{pred.actual}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                      {pred.accuracy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

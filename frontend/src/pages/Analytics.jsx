import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const sample = [
  { name: 'Feature A', value: 120 },
  { name: 'Feature B', value: 98 },
  { name: 'Feature C', value: 86 },
]

export default function Analytics() {
  return (
    <div>
      <h1 className="text-2xl mb-4">Analytics</h1>
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sample}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

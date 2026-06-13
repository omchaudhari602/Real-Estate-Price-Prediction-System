import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function ModelMonitoring() {
  const [models, setModels] = useState([])

  useEffect(() => {
    api.get('/api/v1/models').then((r) => setModels(r.data.models)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl mb-4">Model Monitoring</h1>
      <div className="grid gap-4">
        {models.map((m) => (
          <div key={m} className="p-4 bg-white dark:bg-gray-800 rounded shadow">{m}</div>
        ))}
      </div>
    </div>
  )
}

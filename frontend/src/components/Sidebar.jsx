import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/monitoring', label: 'Model Monitoring' },
  { to: '/settings', label: 'Settings' },
  { to: '/admin', label: 'Admin' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r">
      <div className="p-4 text-xl font-bold">HousePrice</div>
      <nav className="p-4">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

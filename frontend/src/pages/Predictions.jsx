import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Predictions() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      location: 'City Center',
      property_type: 'House'
    }
  })
  
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    setPrediction(null)
    
    const payload = {
      Area: Number(data.square_feet),
      Bedrooms: Number(data.bedrooms),
      Bathrooms: Number(data.bathrooms),
      Age: Number(data.age),
      Location: data.location,
      Property_Type: data.property_type
    }

    try {
      const res = await api.post('/api/v1/predict', { features: payload })
      
      if (res.data && 'prediction' in res.data) {
        setPrediction(res.data.prediction)
        toast.success('Prediction generated successfully!')
      }
    } catch (err) {
      toast.error('Prediction failed. Please check your inputs.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Make a Prediction</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Fields */}
            {[
              { label: 'Area (Sq. Feet)', name: 'square_feet', type: 'number', placeholder: '2500' },
              { label: 'Bedrooms', name: 'bedrooms', type: 'number', placeholder: '3' },
              { label: 'Bathrooms', name: 'bathrooms', type: 'number', placeholder: '2' },
              { label: 'Property Age (Years)', name: 'age', type: 'number', placeholder: '10' }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder={field.placeholder}
                  required
                  {...register(field.name)} 
                />
              </div>
            ))}

            {/* Dropdowns */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" {...register('location')}>
                <option value="City Center">City Center</option>
                <option value="Suburb">Suburb</option>
                <option value="Rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" {...register('property_type')}>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Calculating Valuation...' : 'Predict Price'}
          </button>
        </form>

        {/* Prediction Result Display */}
        {prediction !== null && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-pulse">
            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">Estimated Valuation</h3>
            <p className="text-4xl font-extrabold text-green-900 mt-2">
              ₹{Number(prediction).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
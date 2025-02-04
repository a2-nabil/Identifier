'use client'
import { useState } from 'react'
import { Upload, Loader } from 'lucide-react'
import ResultDisplay from '../components/ResultDisplay'
import Image from 'next/image'

export default function Home() {
  // const [image, setImage] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // setImage(file)
      setPreview(URL.createObjectURL(file))
      identifyObject(file)
    }
  }

  const identifyObject = async (file) => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate file size (4MB limit)
      if (file.size > 4 * 1024 * 1024) {
        throw new Error('Image size must be less than 4MB')
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)')
      }

      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to identify object')
      }
      
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      setResult(data)
      
    } catch (err) {
      console.error('Error details:', err)
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Object Identifier</h1>
        <p className="text-lg text-gray-600">Upload an image and let AI identify what&aposs in it</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg text-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center p-8"
          >
            {preview ? (
              <div className="mb-4 relative">
                <Image
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white text-sm">Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="mb-4 text-center flex items-center justify-center flex-col">
                <Upload className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 4MB</p>
              </div>
            )}
            {!preview && (
              <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Choose Image
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Analyzing your image...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <ResultDisplay result={result} />
      )}
    </main>
  )
}

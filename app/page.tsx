'use client'
import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Image from 'next/image'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreview(URL.createObjectURL(file))
      setResult('')
      setError('')
    }
  }

  const identifyObject = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError('')

    try {
      // Initialize Google Gemini AI
      const genAI = new GoogleGenerativeAI('YOUR_API_KEY') // Replace with your API key
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

      // Convert image to base64
      const buffer = await selectedImage.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      // Create prompt
      const prompt = "Identify the object in this image and provide important information about it. Include: 1. Object name 2. Brief description 3. Common uses 4. Any interesting facts"

      // Generate content
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: selectedImage.type
          }
        }
      ])

      const response = await result.response
      setResult(response.text())
    } catch (err) {
      setError('Error identifying object. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Object Identifier</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="mb-8">
            <label className="block text-center w-full">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-gray-400">
                  {preview ? (
                    <div className="relative w-full h-64">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg mb-2">Drop your image here</p>
                      <p className="text-sm">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={identifyObject}
            disabled={!selectedImage || loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              !selectedImage || loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Identifying...' : 'Identify Object'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-gray-700/50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Results</h2>
              <div className="whitespace-pre-wrap">{result}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
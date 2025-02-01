import './globals.css'

export const metadata = {
  title: 'Object Identifier',
  description: 'Upload an image to identify objects using AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
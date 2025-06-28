'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface PostData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string
  featuredImage: string
  status: string
  template: string
}

interface Template {
  id: string
  name: string
  description: string
  layout: string
  colorScheme: string
  preview: string
}

const templates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern layout with blue accent colors',
    layout: 'standard',
    colorScheme: 'blue',
    preview: 'Default template with clean typography and blue accents'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean layout with minimal distractions',
    layout: 'minimal',
    colorScheme: 'gray',
    preview: 'Minimal design with focus on content readability'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated layout with elegant typography',
    layout: 'elegant',
    colorScheme: 'purple',
    preview: 'Elegant design with sophisticated typography and purple accents'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong and impactful layout with bold colors',
    layout: 'bold',
    colorScheme: 'red',
    preview: 'Bold design with strong visual impact and red accents'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern tech-focused layout with dark accents',
    layout: 'tech',
    colorScheme: 'dark',
    preview: 'Tech-inspired design with modern aesthetics and dark accents'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and creative layout with vibrant colors',
    layout: 'creative',
    colorScheme: 'gradient',
    preview: 'Creative design with artistic elements and gradient colors'
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Professional magazine-style layout with grid elements',
    layout: 'magazine',
    colorScheme: 'black',
    preview: 'Magazine-style layout with professional typography and grid design'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Classic blog layout with sidebar-style elements',
    layout: 'blog',
    colorScheme: 'green',
    preview: 'Classic blog design with traditional layout and green accents'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with clean lines and subtle shadows',
    layout: 'modern',
    colorScheme: 'slate',
    preview: 'Modern design with contemporary aesthetics and clean typography'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro-inspired layout with classic typography',
    layout: 'vintage',
    colorScheme: 'amber',
    preview: 'Vintage design with retro aesthetics and classic typography'
  }
]

const getTemplateStyles = (template: string) => {
  switch (template) {
    case 'minimal':
      return {
        container: 'max-w-2xl mx-auto',
        header: 'text-center mb-16 border-b border-gray-100 pb-12',
        title: 'text-5xl font-extralight text-gray-900 mb-8 leading-tight tracking-wide',
        excerpt: 'text-xl text-gray-400 leading-relaxed mb-8 font-light max-w-2xl mx-auto',
        content: 'prose prose-lg max-w-none text-gray-600 font-light leading-relaxed prose-headings:font-light prose-headings:text-gray-800 prose-p:text-lg prose-p:leading-relaxed',
        category: 'inline-block bg-gray-50 text-gray-500 text-xs px-4 py-2 rounded-full font-light tracking-widest uppercase',
        tags: 'inline-block bg-white border border-gray-100 text-gray-400 text-xs px-3 py-1 rounded-full font-light'
      }
    case 'elegant':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'text-center mb-20 border-b border-purple-200 pb-16',
        title: 'text-7xl font-serif text-gray-900 mb-10 leading-tight tracking-tight font-bold',
        excerpt: 'text-2xl text-gray-500 leading-relaxed mb-10 italic font-serif max-w-4xl mx-auto font-medium',
        content: 'prose prose-xl max-w-none text-gray-700 font-serif leading-relaxed prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-xl prose-p:leading-relaxed prose-p:font-serif',
        category: 'inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-6 py-3 rounded-full font-bold tracking-widest uppercase shadow-sm',
        tags: 'inline-block bg-purple-50 text-purple-600 text-xs px-4 py-2 rounded-full font-medium border border-purple-100'
      }
    case 'bold':
      return {
        container: 'max-w-5xl mx-auto',
        header: 'mb-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-12 rounded-3xl border-l-8 border-red-500 shadow-xl',
        title: 'text-6xl font-black text-gray-900 mb-8 leading-tight uppercase tracking-widest',
        excerpt: 'text-3xl text-gray-700 leading-relaxed mb-8 font-black uppercase tracking-wide',
        content: 'prose prose-xl max-w-none text-gray-800 font-bold prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-red-800 prose-p:text-lg prose-p:font-semibold',
        category: 'inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-6 py-3 rounded-full font-black uppercase tracking-widest shadow-lg',
        tags: 'inline-block bg-red-100 text-red-700 text-xs px-4 py-2 rounded-full font-black uppercase tracking-wide border-2 border-red-200'
      }
    case 'tech':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'mb-12 bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white p-12 rounded-3xl shadow-2xl border border-gray-700',
        title: 'text-6xl font-bold text-white mb-8 leading-tight font-mono tracking-tight',
        excerpt: 'text-2xl text-gray-300 leading-relaxed mb-8 font-mono tracking-wide',
        content: 'prose prose-xl max-w-none text-gray-800 prose-headings:text-gray-900 prose-headings:font-mono prose-headings:font-bold prose-code:bg-gray-900 prose-code:text-green-400 prose-code:border prose-code:border-gray-700 prose-pre:bg-gray-900 prose-pre:text-green-400 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-p:text-lg prose-p:font-mono',
        category: 'inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-6 py-3 rounded-full font-mono tracking-widest uppercase shadow-lg',
        tags: 'inline-block bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-full font-mono border border-gray-600'
      }
    case 'creative':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-12 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300',
        title: 'text-6xl font-black text-white mb-8 leading-tight drop-shadow-2xl',
        excerpt: 'text-3xl text-white leading-relaxed mb-8 opacity-95 font-bold drop-shadow-lg',
        content: 'prose prose-xl max-w-none text-gray-800 prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-pink-500 prose-headings:to-purple-600 prose-headings:font-black prose-p:text-lg prose-p:font-medium',
        category: 'inline-block bg-white bg-opacity-30 text-white text-xs px-6 py-3 rounded-full font-black backdrop-blur-md border border-white border-opacity-20 shadow-lg',
        tags: 'inline-block bg-white bg-opacity-20 text-white text-xs px-4 py-2 rounded-full font-bold backdrop-blur-sm border border-white border-opacity-10'
      }
    case 'magazine':
      return {
        container: 'max-w-6xl mx-auto',
        header: 'mb-16 border-b-8 border-black pb-12',
        title: 'text-8xl font-black text-black mb-10 leading-tight tracking-tight uppercase',
        excerpt: 'text-3xl text-gray-700 leading-relaxed mb-10 font-black uppercase tracking-wide max-w-5xl',
        content: 'prose prose-2xl max-w-none text-gray-800 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:border-b-4 prose-headings:border-gray-300 prose-headings:pb-4 prose-p:text-xl prose-p:font-medium',
        category: 'inline-block bg-black text-white text-xs px-8 py-4 rounded-none font-black uppercase tracking-widest border-2 border-black',
        tags: 'inline-block bg-gray-100 text-gray-800 text-xs px-4 py-2 rounded-none font-black uppercase border-2 border-gray-300'
      }
    case 'blog':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'mb-12 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-10 rounded-2xl border-l-8 border-green-500 shadow-lg',
        title: 'text-5xl font-bold text-gray-900 mb-8 leading-tight',
        excerpt: 'text-2xl text-gray-600 leading-relaxed mb-8 font-semibold',
        content: 'prose prose-xl max-w-none text-gray-800 prose-headings:text-green-800 prose-headings:border-l-8 prose-headings:border-green-500 prose-headings:pl-6 prose-headings:font-bold prose-p:text-lg prose-p:font-medium',
        category: 'inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-6 py-3 rounded-full font-bold shadow-lg',
        tags: 'inline-block bg-green-50 text-green-700 text-xs px-4 py-2 rounded-full font-bold border-2 border-green-200'
      }
    case 'modern':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'mb-16 bg-gradient-to-br from-slate-50 to-gray-50 p-12 rounded-3xl shadow-2xl border border-gray-100',
        title: 'text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight',
        excerpt: 'text-2xl text-gray-600 leading-relaxed mb-8 font-medium max-w-4xl',
        content: 'prose prose-xl max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium',
        category: 'inline-block bg-gradient-to-r from-slate-600 to-gray-600 text-white text-xs px-6 py-3 rounded-full font-bold tracking-wide shadow-lg',
        tags: 'inline-block bg-slate-100 text-slate-700 text-xs px-4 py-2 rounded-full font-semibold border border-slate-200'
      }
    case 'vintage':
      return {
        container: 'max-w-4xl mx-auto',
        header: 'mb-16 bg-gradient-to-br from-amber-50 to-orange-50 p-12 rounded-2xl border-4 border-amber-200 shadow-xl',
        title: 'text-6xl font-serif text-amber-900 mb-8 leading-tight font-bold',
        excerpt: 'text-2xl text-amber-700 leading-relaxed mb-8 font-serif italic',
        content: 'prose prose-xl max-w-none text-amber-800 prose-headings:font-serif prose-headings:text-amber-900 prose-headings:font-bold prose-headings:border-b-2 prose-headings:border-amber-300 prose-headings:pb-2 prose-p:text-lg prose-p:font-serif',
        category: 'inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-6 py-3 rounded-full font-bold tracking-widest uppercase shadow-lg',
        tags: 'inline-block bg-amber-100 text-amber-800 text-xs px-4 py-2 rounded-full font-bold border-2 border-amber-200'
      }
    default: // default
      return {
        container: 'max-w-4xl mx-auto',
        header: 'mb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-10 rounded-2xl border-l-8 border-blue-500 shadow-lg',
        title: 'text-5xl font-bold text-gray-900 mb-8 leading-tight',
        excerpt: 'text-2xl text-gray-600 leading-relaxed mb-8 font-medium',
        content: 'prose prose-xl max-w-none text-gray-800 prose-headings:text-blue-800 prose-headings:border-l-8 prose-headings:border-blue-500 prose-headings:pl-6 prose-headings:font-bold prose-p:text-lg prose-p:font-medium',
        category: 'inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-6 py-3 rounded-full font-bold shadow-lg',
        tags: 'inline-block bg-blue-100 text-blue-700 text-xs px-4 py-2 rounded-full font-semibold border-2 border-blue-200'
      }
  }
}

export default function PreviewPage() {
  const router = useRouter()
  const [postData, setPostData] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('default')

  useEffect(() => {
    const savedData = localStorage.getItem('previewPostData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setPostData(data)
      setSelectedTemplate(data.template || 'default')
    }
    setIsLoading(false)
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (postData) {
      const updatedData = { ...postData, template: templateId }
      setPostData(updatedData)
      localStorage.setItem('previewPostData', JSON.stringify(updatedData))
    }
    setShowTemplates(false)
  }

  const handlePublish = async () => {
    if (!postData) return

    setIsPublishing(true)
    
    try {
      // Update post data with published status
      const publishedData = { ...postData, status: 'published' }
      
      console.log('Publishing post data:', publishedData)
      
      // Make actual API call to publish the post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishedData),
      })

      console.log('Publish response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Publish error response:', errorData)
        throw new Error(errorData.error || 'Failed to publish post')
      }

      const result = await response.json()
      console.log('Publish success result:', result)
      
      // Clear preview data from localStorage
      localStorage.removeItem('previewPostData')
      
      // Show success message
      alert(`✅ ${result.message}`)
      
      // Redirect to admin posts page
      router.push('/admin/posts')
    } catch (error) {
      console.error('Publishing error:', error)
      alert(`❌ Failed to publish post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!postData) return

    setIsPublishing(true)
    
    try {
      // Update post data with draft status
      const draftData = { ...postData, status: 'draft' }
      
      console.log('Saving draft data:', draftData)
      
      // Make actual API call to save as draft
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      })

      console.log('Save draft response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save draft error response:', errorData)
        throw new Error(errorData.error || 'Failed to save draft')
      }

      const result = await response.json()
      console.log('Save draft success result:', result)
      
      // Clear preview data from localStorage
      localStorage.removeItem('previewPostData')
      
      // Show success message
      alert(`✅ ${result.message}`)
      
      // Redirect to admin posts page
      router.push('/admin/posts')
    } catch (error) {
      console.error('Save draft error:', error)
      alert(`❌ Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Preview Data</h1>
          <p className="text-gray-600 mb-6">No post data found. Please go back and create a post first.</p>
          <Link 
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Editor
          </Link>
        </div>
      </div>
    )
  }

  const template = selectedTemplate
  const styles = getTemplateStyles(template)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Home</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href="/admin/posts/new"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                New Post
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Preview</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Templates
              </button>
              <span className="text-sm text-gray-500">Template:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {template.charAt(0).toUpperCase() + template.slice(1)}
              </span>
              <button
                onClick={handleSaveDraft}
                disabled={isPublishing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPublishing ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPublishing ? (
                  <>
                    <svg className="w-4 h-4 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post
                  </>
                )}
              </button>
              <Link
                href="/admin/posts/new"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to Editor
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Choose Template</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-1">Select a template to change the layout and styling of your post</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {selectedTemplate === template.id && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="bg-gray-100 rounded p-2 text-xs text-gray-500">
                      {template.preview}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Content */}
      <main className={`${styles.container} px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Post Preview</h1>
              <div className="flex items-center space-x-2">
                <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                  {template.charAt(0).toUpperCase() + template.slice(1)} Template
                </span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-8">
            {/* Post Header */}
            <div className={styles.header}>
              <div className="flex flex-wrap gap-2 mb-4">
                {postData.category && (
                  <span className={styles.category}>
                    {postData.category}
                  </span>
                )}
                {postData.tags && postData.tags.split(',').map((tag, index) => (
                  <span key={index} className={styles.tags}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <h1 className={styles.title}>
                {postData.title || 'Untitled Post'}
              </h1>
              {postData.excerpt && (
                <p className={styles.excerpt}>
                  {postData.excerpt}
                </p>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <span>By Admin</span>
                <span className="mx-2">•</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Featured Image */}
            {postData.featuredImage && (
              <div className="mb-8">
                <img 
                  src={postData.featuredImage} 
                  alt="Featured" 
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Post Content */}
            <div className={styles.content}>
              {postData.content ? (
                <ReactMarkdown>{postData.content}</ReactMarkdown>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 italic text-lg">No content yet. Start writing your post in the editor!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
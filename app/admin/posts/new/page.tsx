'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'
import { dbNonNull as db } from '@/lib/db'
import { categories, tags } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { formatDistanceToNow } from 'date-fns'

interface Section {
  id: string
  type: 'header' | 'subheader' | 'paragraph' | 'list' | 'quote' | 'image' | 'code' | 'divider' | 'callout' | 'table'
  content: string
  level?: number // for headers
  listType?: 'ul' | 'ol' // for lists
  calloutType?: 'info' | 'warning' | 'success' | 'error' // for callouts
  textStyle?: 'normal' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'highlight' | 'code' // for text styling
}

export default function NewPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [hasPreviewedAfterBulk, setHasPreviewedAfterBulk] = useState(false)
  const [showSections, setShowSections] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    template: 'default'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Make actual API call to create the post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const result = await response.json()
      
      // Show success message
      alert(`✅ ${result.message}`)
      
      // Redirect to admin posts page
      router.push('/admin/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      alert(`❌ Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }))
    handleSubmit(new Event('submit') as any)
  }

  const handlePublish = () => {
    // Check if user has previewed after bulk mode
    if (isBulkMode && !hasPreviewedAfterBulk) {
      alert('⚠️ Please preview your post first after using bulk mode to see how it will look before publishing!')
      return
    }
    
    setFormData(prev => ({ ...prev, status: 'published' }))
    handleSubmit(new Event('submit') as any)
  }

  const handlePreview = () => {
    // Save form data to localStorage for the preview page
    localStorage.setItem('previewPostData', JSON.stringify(formData))
    
    // Mark as previewed if in bulk mode
    if (isBulkMode) {
      setHasPreviewedAfterBulk(true)
    }
    
    router.push('/admin/posts/preview')
  }

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode)
    // Reset preview status when switching modes
    setHasPreviewedAfterBulk(false)
  }

  const handleAnalyzeText = async () => {
    if (!formData.content.trim()) {
      alert('Please enter some content to analyze')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: formData.content }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze text')
      }

      const analysis = await response.json()
      
      // Update form data with analyzed results
      setFormData(prev => ({
        ...prev,
        title: analysis.title || prev.title,
        content: analysis.improvedContent || prev.content,
        excerpt: analysis.excerpt || prev.excerpt,
        category: analysis.category || prev.category,
        tags: analysis.tags || prev.tags,
      }))

      // Reset preview status since content has changed
      setHasPreviewedAfterBulk(false)

      // Show success message
      alert(`Text analysis complete! 
- Title generated: ${analysis.title}
- Content improved (${analysis.originalLength} → ${analysis.improvedLength} characters)
- Category suggested: ${analysis.category}
- Tags generated: ${analysis.tags}

⚠️ Please preview your post to see how it will look before publishing!`)
    } catch (error) {
      console.error('Text analysis error:', error)
      alert('Failed to analyze text. Please check your Cohere API key and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addSection = (type: Section['type'], level?: number, listType?: 'ul' | 'ol', calloutType?: 'info' | 'warning' | 'success' | 'error', textStyle?: 'normal' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'highlight' | 'code') => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: '',
      level,
      listType,
      calloutType,
      textStyle: textStyle || 'normal'
    }
    setSections(prev => [...prev, newSection])
    setShowSections(false)
  }

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id))
  }

  const updateSection = (id: string, content: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ))
  }

  const updateSectionStyle = (id: string, textStyle: 'normal' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'highlight' | 'code') => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, textStyle } : section
    ))
  }

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const index = prev.findIndex(section => section.id === id)
      if (index === -1) return prev
      
      const newSections = [...prev]
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      }
      return newSections
    })
  }

  const generateContentFromSections = () => {
    return sections.map(section => {
      const applyTextStyle = (text: string, style?: string) => {
        if (!style || style === 'normal') return text
        switch (style) {
          case 'bold':
            return `**${text}**`
          case 'italic':
            return `*${text}*`
          case 'underline':
            return `<u>${text}</u>`
          case 'strikethrough':
            return `~~${text}~~`
          case 'highlight':
            return `==${text}==`
          case 'code':
            return `\`${text}\``
          default:
            return text
        }
      }

      switch (section.type) {
        case 'header':
          return `${'#'.repeat(section.level || 1)} ${applyTextStyle(section.content, section.textStyle)}`
        case 'subheader':
          return `${'#'.repeat(section.level || 2)} ${applyTextStyle(section.content, section.textStyle)}`
        case 'paragraph':
          return applyTextStyle(section.content, section.textStyle)
        case 'list':
          const listItems = section.content.split('\n').filter(item => item.trim())
          const prefix = section.listType === 'ol' ? '1.' : '-'
          return listItems.map(item => `${prefix} ${applyTextStyle(item, section.textStyle)}`).join('\n')
        case 'quote':
          return `> ${applyTextStyle(section.content, section.textStyle)}`
        case 'image':
          // Handle image with optional alt text and caption
          const [altText, caption] = section.content.split('|').map(s => s.trim())
          return `![${altText || 'Image'}](${caption || 'image-url'})`
        case 'code':
          return `\`\`\`\n${section.content}\n\`\`\``
        case 'divider':
          return `---`
        case 'callout':
          const calloutIcon = {
            info: 'ℹ️',
            warning: '⚠️',
            success: '✅',
            error: '❌'
          }[section.calloutType || 'info']
          return `> ${calloutIcon} **${section.calloutType?.toUpperCase() || 'INFO'}**: ${applyTextStyle(section.content, section.textStyle)}`
        case 'table':
          // Simple table format - first line is headers, rest are data
          const lines = section.content.split('\n').filter(line => line.trim())
          if (lines.length === 0) return ''
          
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h)
          const separator = headers.map(() => '---').join(' | ')
          const dataRows = lines.slice(1).map(line => 
            line.split('|').map(cell => cell.trim()).filter(cell => cell).join(' | ')
          )
          
          return [
            `| ${headers.join(' | ')} |`,
            `| ${separator} |`,
            ...dataRows.map(row => `| ${row} |`)
          ].join('\n')
        default:
          return applyTextStyle(section.content, section.textStyle)
      }
    }).join('\n\n')
  }

  const applySectionsToContent = () => {
    const generatedContent = generateContentFromSections()
    setFormData(prev => ({ ...prev, content: generatedContent }))
    setShowSections(false)
  }

  const getSectionPlaceholder = (type: Section['type'], level?: number, listType?: 'ul' | 'ol', calloutType?: 'info' | 'warning' | 'success' | 'error') => {
    switch (type) {
      case 'header':
        return `Enter ${level === 1 ? 'Main Title' : level === 2 ? 'Section Title' : 'Subsection Title'}...`
      case 'paragraph':
        return 'Enter text content...'
      case 'list':
        return 'Enter list items separated by new lines...'
      case 'quote':
        return 'Enter a blockquote...'
      case 'image':
        return 'Enter image URL and optional alt text | Enter image caption...'
      case 'code':
        return 'Enter code snippet...'
      case 'divider':
        return 'Enter a horizontal line...'
      case 'callout':
        return `Enter ${calloutType?.toUpperCase() || 'INFO'} callout content...`
      case 'table':
        return 'Enter table data in the format: Column1 | Column2 | Column3...'
      default:
        return 'Enter content...'
    }
  }

  const getSectionRows = (type: Section['type']) => {
    switch (type) {
      case 'header':
        return 1
      case 'paragraph':
        return 4
      case 'list':
        return 10
      case 'quote':
        return 3
      case 'image':
        return 2
      case 'code':
        return 10
      case 'divider':
        return 1
      case 'callout':
        return 4
      case 'table':
        return 10
      default:
        return 2
    }
  }

  const renderSectionPreview = (section: Section) => {
    const applyTextStyle = (text: string, style?: string) => {
      if (!style || style === 'normal') return text
      switch (style) {
        case 'bold':
          return `**${text}**`
        case 'italic':
          return `*${text}*`
        case 'underline':
          return `<u>${text}</u>`
        case 'strikethrough':
          return `~~${text}~~`
        case 'highlight':
          return `==${text}==`
        case 'code':
          return `\`${text}\``
        default:
          return text
      }
    }

    switch (section.type) {
      case 'header':
        return `${'#'.repeat(section.level || 1)} ${applyTextStyle(section.content, section.textStyle)}`
      case 'subheader':
        return `${'#'.repeat(section.level || 2)} ${applyTextStyle(section.content, section.textStyle)}`
      case 'paragraph':
        return applyTextStyle(section.content, section.textStyle)
      case 'list':
        const listItems = section.content.split('\n').filter(item => item.trim())
        const prefix = section.listType === 'ol' ? '1.' : '-'
        return listItems.map(item => `${prefix} ${applyTextStyle(item, section.textStyle)}`).join('\n')
      case 'quote':
        return `> ${applyTextStyle(section.content, section.textStyle)}`
      case 'image':
        // Handle image with optional alt text and caption
        const [altText, caption] = section.content.split('|').map(s => s.trim())
        return `![${altText || 'Image'}](${caption || 'image-url'})`
      case 'code':
        return `\`\`\`\n${section.content}\n\`\`\``
      case 'divider':
        return `---`
      case 'callout':
        const calloutIcon = {
          info: 'ℹ️',
          warning: '⚠️',
          success: '✅',
          error: '❌'
        }[section.calloutType || 'info']
        return `> ${calloutIcon} **${section.calloutType?.toUpperCase() || 'INFO'}**: ${applyTextStyle(section.content, section.textStyle)}`
      case 'table':
        // Simple table format - first line is headers, rest are data
        const lines = section.content.split('\n').filter(line => line.trim())
        if (lines.length === 0) return ''
        
        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h)
        const separator = headers.map(() => '---').join(' | ')
        const dataRows = lines.slice(1).map(line => 
          line.split('|').map(cell => cell.trim()).filter(cell => cell).join(' | ')
        )
        
        return [
          `| ${headers.join(' | ')} |`,
          `| ${separator} |`,
          ...dataRows.map(row => `| ${row} |`)
        ].join('\n')
      default:
        return applyTextStyle(section.content, section.textStyle)
    }
  }

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
              <span className="text-gray-900 font-medium">New Post</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleBulkMode}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isBulkMode 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {isBulkMode ? 'Standard Mode' : 'Bulk Mode'}
              </button>
              {!isBulkMode && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowSections(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Manage Sections
                  </button>
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Preview
                  </button>
                </>
              )}
              <button
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isBulkMode && !hasPreviewedAfterBulk
                    ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
                    : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isBulkMode && !hasPreviewedAfterBulk ? 'Preview required before publishing in bulk mode' : ''}
              >
                {isLoading ? 'Publishing...' : isBulkMode && !hasPreviewedAfterBulk ? 'Preview First!' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Warning for Bulk Mode */}
      {isBulkMode && !hasPreviewedAfterBulk && (formData.title || formData.excerpt || formData.tags || formData.category) && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-800">
                <strong>Preview Required:</strong> Please preview your post to see how it will look before publishing!
              </span>
            </div>
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Preview Now →
            </button>
          </div>
        </div>
      )}

      {/* Sections Modal */}
      {showSections && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Manage Content Sections</h2>
                <button
                  onClick={() => setShowSections(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-1">Add, remove, and organize different content sections for your post</p>
            </div>
            
            <div className="p-6">
              {/* Section Templates */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Section</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => addSection('header', 1)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">H1 Header</div>
                    <div className="text-sm text-gray-600">Main title</div>
                  </button>
                  <button
                    onClick={() => addSection('header', 2)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">H2 Header</div>
                    <div className="text-sm text-gray-600">Section title</div>
                  </button>
                  <button
                    onClick={() => addSection('header', 3)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">H3 Header</div>
                    <div className="text-sm text-gray-600">Subsection title</div>
                  </button>
                  <button
                    onClick={() => addSection('paragraph')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Paragraph</div>
                    <div className="text-sm text-gray-600">Text content</div>
                  </button>
                  <button
                    onClick={() => addSection('list', undefined, 'ul')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Bullet List</div>
                    <div className="text-sm text-gray-600">Unordered list</div>
                  </button>
                  <button
                    onClick={() => addSection('list', undefined, 'ol')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Numbered List</div>
                    <div className="text-sm text-gray-600">Ordered list</div>
                  </button>
                  <button
                    onClick={() => addSection('quote')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Quote</div>
                    <div className="text-sm text-gray-600">Blockquote</div>
                  </button>
                  <button
                    onClick={() => addSection('code')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Code Block</div>
                    <div className="text-sm text-gray-600">Code snippet</div>
                  </button>
                  <button
                    onClick={() => addSection('image')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Image</div>
                    <div className="text-sm text-gray-600">Image with alt text</div>
                  </button>
                  <button
                    onClick={() => addSection('divider')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Divider</div>
                    <div className="text-sm text-gray-600">Horizontal line</div>
                  </button>
                  <button
                    onClick={() => addSection('callout', undefined, undefined, 'info')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Info Callout</div>
                    <div className="text-sm text-gray-600">Information box</div>
                  </button>
                  <button
                    onClick={() => addSection('callout', undefined, undefined, 'warning')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Warning Callout</div>
                    <div className="text-sm text-gray-600">Warning box</div>
                  </button>
                  <button
                    onClick={() => addSection('callout', undefined, undefined, 'success')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Success Callout</div>
                    <div className="text-sm text-gray-600">Success box</div>
                  </button>
                  <button
                    onClick={() => addSection('table')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">Table</div>
                    <div className="text-sm text-gray-600">Data table</div>
                  </button>
                </div>
              </div>

              {/* Text Styling Options */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Text Styling</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => addSection('paragraph', undefined, undefined, undefined, 'bold')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-bold text-gray-900">Bold Text</div>
                    <div className="text-sm text-gray-600">Emphasized content</div>
                  </button>
                  <button
                    onClick={() => addSection('paragraph', undefined, undefined, undefined, 'italic')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="italic text-gray-900">Italic Text</div>
                    <div className="text-sm text-gray-600">Stylized content</div>
                  </button>
                  <button
                    onClick={() => addSection('paragraph', undefined, undefined, undefined, 'highlight')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900 bg-yellow-200 px-2 py-1 rounded">Highlighted</div>
                    <div className="text-sm text-gray-600">Important content</div>
                  </button>
                  <button
                    onClick={() => addSection('paragraph', undefined, undefined, undefined, 'code')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">Inline Code</div>
                    <div className="text-sm text-gray-600">Code references</div>
                  </button>
                </div>
              </div>

              {/* Current Sections */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Sections ({sections.length})</h3>
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No sections added yet. Click above to add your first section!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                              {section.level && ` H${section.level}`}
                              {section.listType && ` (${section.listType.toUpperCase()})`}
                              {section.calloutType && ` (${section.calloutType.toUpperCase()})`}
                            </span>
                            <span className="text-sm text-gray-500">Section {index + 1}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {/* Text Style Selector */}
                            {section.type !== 'divider' && section.type !== 'image' && (
                              <select
                                value={section.textStyle || 'normal'}
                                onChange={(e) => updateSectionStyle(section.id, e.target.value as any)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="italic">Italic</option>
                                <option value="underline">Underline</option>
                                <option value="strikethrough">Strikethrough</option>
                                <option value="highlight">Highlight</option>
                                <option value="code">Code</option>
                              </select>
                            )}
                            <button
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === sections.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeSection(section.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, e.target.value)}
                          placeholder={getSectionPlaceholder(section.type, section.level, section.listType, section.calloutType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                          rows={getSectionRows(section.type)}
                        />
                        {/* Preview of how the section will look */}
                        {section.content && (
                          <div className="mt-3 p-3 bg-white border border-gray-200 rounded-md">
                            <div className="text-xs font-medium text-gray-500 mb-2">Preview:</div>
                            <div className="text-sm text-gray-700">
                              {renderSectionPreview(section)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSections(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applySectionsToContent}
                  disabled={sections.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply to Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="text-gray-600 mt-1">
                  {isBulkMode ? 'Bulk mode: Write your entire post in one text area' : 'Write and publish your next blog post'}
                </p>
              </div>
              {!isBulkMode && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Template:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                </div>
              )}
            </div>
          </div>

          {isBulkMode ? (
            /* Bulk Mode - Single Text Area */
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="bulkContent" className="block text-sm font-medium text-gray-700">
                    Post Content *
                  </label>
                  <button
                    type="button"
                    onClick={handleAnalyzeText}
                    disabled={isAnalyzing || !formData.content.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="w-4 h-4 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Analyze Text
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="bulkContent"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={30}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y font-mono text-sm"
                  placeholder="Write your entire post here... You can include title, content, and formatting in one place. Click 'Analyze Text' to automatically generate title, excerpt, tags, and improve your content using AI."
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Write your entire post in this text area. Click "Analyze Text" to automatically generate title, excerpt, tags, and improve your content using AI.
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.content.length} characters
                  </p>
                </div>
              </div>

              {/* Analysis Results Display */}
              {(formData.title || formData.excerpt || formData.tags || formData.category) && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-3">AI Analysis Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {formData.title && (
                      <div>
                        <span className="font-medium text-green-700">Title:</span>
                        <p className="text-green-800 mt-1">{formData.title}</p>
                      </div>
                    )}
                    {formData.excerpt && (
                      <div>
                        <span className="font-medium text-green-700">Excerpt:</span>
                        <p className="text-green-800 mt-1">{formData.excerpt}</p>
                      </div>
                    )}
                    {formData.category && (
                      <div>
                        <span className="font-medium text-green-700">Category:</span>
                        <p className="text-green-800 mt-1 capitalize">{formData.category}</p>
                      </div>
                    )}
                    {formData.tags && (
                      <div>
                        <span className="font-medium text-green-700">Tags:</span>
                        <p className="text-green-800 mt-1">{formData.tags}</p>
                      </div>
                    )}
                  </div>
                  {!hasPreviewedAfterBulk && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-yellow-800">
                          <strong>Next step:</strong> Preview your post to see how it will look before publishing!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Standard Mode - Full Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your post title..."
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                  placeholder="Write your post content here... You can use markdown formatting."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supports markdown formatting. Use **bold**, *italic*, [links](url), and more.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                  placeholder="A brief summary of your post (optional)"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This will appear in post previews and search results.
                </p>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a category</option>
                    <option value="technology">Technology</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="travel">Travel</option>
                    <option value="food">Food</option>
                    <option value="health">Health</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Separate multiple tags with commas (e.g., tech, web, design)
                  </p>
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(value) => setFormData(prev => ({ ...prev, featuredImage: value }))}
                />
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
} 
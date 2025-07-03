'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { dbNonNull as db } from '@/lib/db'
import { categories, tags } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { formatDistanceToNow } from 'date-fns'

interface AIGenerationOptions {
  topic: string
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative' | 'technical'
  length: 'short' | 'medium' | 'long'
  style: 'blog' | 'article' | 'tutorial' | 'review' | 'news' | 'opinion'
  includeTitle: boolean
  includeExcerpt: boolean
  includeTags: boolean
  includeCategory: boolean
  customPrompt: string
  aiProvider: 'openai' | 'huggingface' | 'gemini' | 'mistral'
  model: string
}

interface AIModel {
  id: string
  name: string
  description: string
  maxTokens: number
  pricing: string
  capabilities: string[]
}

const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    description: 'Advanced language models with excellent text generation capabilities',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Latest GPT-4 model with improved performance',
        maxTokens: 128000,
        pricing: '$0.005/1K tokens',
        capabilities: ['High quality', 'Creative writing', 'Code generation']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Faster and more cost-effective GPT-4 variant',
        maxTokens: 128000,
        pricing: '$0.00015/1K tokens',
        capabilities: ['Fast', 'Cost-effective', 'Good quality']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Reliable and fast model for general text generation',
        maxTokens: 16385,
        pricing: '$0.0005/1K tokens',
        capabilities: ['Fast', 'Reliable', 'Good for blogs']
      }
    ]
  },
  huggingface: {
    name: 'Hugging Face',
    description: 'Open-source models and inference APIs',
    models: [
      {
        id: 'meta-llama/Llama-3-8B-Instruct',
        name: 'Llama 3 8B Instruct',
        description: 'Meta\'s latest open-source instruction-tuned model',
        maxTokens: 8192,
        pricing: 'Free (self-hosted)',
        capabilities: ['Open source', 'Good performance', 'Customizable']
      },
      {
        id: 'microsoft/DialoGPT-medium',
        name: 'DialoGPT Medium',
        description: 'Conversational AI model good for interactive content',
        maxTokens: 1024,
        pricing: 'Free (self-hosted)',
        capabilities: ['Conversational', 'Interactive', 'Lightweight']
      },
      {
        id: 'gpt2',
        name: 'GPT-2',
        description: 'Classic text generation model',
        maxTokens: 1024,
        pricing: 'Free (self-hosted)',
        capabilities: ['Classic', 'Stable', 'Well-tested']
      }
    ]
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google\'s advanced multimodal AI models',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Latest Gemini model with enhanced reasoning',
        maxTokens: 1000000,
        pricing: '$0.0035/1M tokens',
        capabilities: ['Multimodal', 'Long context', 'Advanced reasoning']
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient Gemini model',
        maxTokens: 1000000,
        pricing: '$0.000075/1M tokens',
        capabilities: ['Fast', 'Efficient', 'Cost-effective']
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        description: 'Reliable Gemini model for text generation',
        maxTokens: 32768,
        pricing: '$0.0005/1K tokens',
        capabilities: ['Reliable', 'Good quality', 'Stable']
      }
    ]
  },
  mistral: {
    name: 'Mistral AI',
    description: 'French company offering open-weight LLMs',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        description: 'Latest reasoning-focused model with 32K context',
        maxTokens: 32768,
        pricing: '€0.14/1M tokens',
        capabilities: ['Reasoning', 'Multilingual', 'High quality', 'Long context']
      },
      {
        id: 'mistral-medium-latest',
        name: 'Mistral Medium',
        description: 'Balanced performance and cost model',
        maxTokens: 32768,
        pricing: '€0.24/1M tokens',
        capabilities: ['Balanced', 'Good performance', 'Cost-effective']
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        description: 'Fast and efficient model for quick responses',
        maxTokens: 32768,
        pricing: '€0.14/1M tokens',
        capabilities: ['Fast', 'Efficient', 'Lightweight', 'Quick responses']
      },
      {
        id: 'open-mistral-7b',
        name: 'Open Mistral 7B',
        description: 'Open-source model for self-hosting',
        maxTokens: 32768,
        pricing: 'Free (self-hosted)',
        capabilities: ['Open source', 'Self-hosted', 'Customizable']
      }
    ]
  }
}

export default function AIGeneratePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedExcerpt, setGeneratedExcerpt] = useState('')
  const [generatedTags, setGeneratedTags] = useState('')
  const [generatedCategory, setGeneratedCategory] = useState('')
  const [options, setOptions] = useState<AIGenerationOptions>({
    topic: '',
    tone: 'professional',
    length: 'medium',
    style: 'blog',
    includeTitle: true,
    includeExcerpt: true,
    includeTags: true,
    includeCategory: true,
    customPrompt: '',
    aiProvider: 'openai',
    model: 'gpt-4o-mini'
  })

  const handleOptionChange = (key: keyof AIGenerationOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const generatePost = async () => {
    if (!options.topic.trim()) {
      alert('Please enter a topic for your post')
      return
    }

    setIsGenerating(true)
    try {
      // Build the prompt based on options
      let prompt = `Write a ${options.length} ${options.style} post about "${options.topic}" in a ${options.tone} tone.`
      
      if (options.customPrompt) {
        prompt = options.customPrompt
      }

      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: prompt,
          generatePost: true,
          options: options
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const result = await response.json()
      
      setGeneratedContent(result.improvedContent || result.content || '')
      setGeneratedTitle(result.title || '')
      setGeneratedExcerpt(result.excerpt || '')
      setGeneratedTags(result.tags || '')
      setGeneratedCategory(result.category || '')

      // Show success message
      alert('✅ AI post generated successfully! You can now edit and customize the content.')
    } catch (error) {
      console.error('Error generating post:', error)
      alert('❌ Failed to generate post. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
    }

  }

  const useGeneratedContent = () => {
    // Save to localStorage for the new post page
    const postData = {
      title: generatedTitle,
      content: generatedContent,
      excerpt: generatedExcerpt,
      tags: generatedTags,
      category: generatedCategory,
      status: 'draft',
      template: 'default'
    }
    
    localStorage.setItem('previewPostData', JSON.stringify(postData))
    router.push('/admin/posts/new')
  }

  const regeneratePost = () => {
    setGeneratedContent('')
    setGeneratedTitle('')
    setGeneratedExcerpt('')
    setGeneratedTags('')
    setGeneratedCategory('')
  }

  const getSelectedModel = (): AIModel | undefined => {
    const provider = AI_PROVIDERS[options.aiProvider]
    return provider?.models.find(model => model.id === options.model)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Admin</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">AI Post Generator</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/posts/new"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manual Editor
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Post Generator</h1>
              <p className="text-gray-600">Generate blog posts using multiple AI providers</p>
            </div>

            {/* AI Provider Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AI Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleOptionChange('aiProvider', key)
                      handleOptionChange('model', provider.models[0].id)
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      options.aiProvider === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{provider.name}</div>
                    <div className="text-sm text-gray-600">{provider.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={options.model}
                onChange={(e) => handleOptionChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {AI_PROVIDERS[options.aiProvider]?.models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
              {getSelectedModel() && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div><strong>Max Tokens:</strong> {getSelectedModel()?.maxTokens.toLocaleString()}</div>
                    <div><strong>Pricing:</strong> {getSelectedModel()?.pricing}</div>
                    <div><strong>Capabilities:</strong> {getSelectedModel()?.capabilities.join(', ')}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Topic Input */}
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                id="topic"
                value={options.topic}
                onChange={(e) => handleOptionChange('topic', e.target.value)}
                placeholder="Enter the main topic of your post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Generation Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={options.tone}
                  onChange={(e) => handleOptionChange('tone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <select
                  value={options.length}
                  onChange={(e) => handleOptionChange('length', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="short">Short (~300 words)</option>
                  <option value="medium">Medium (~600 words)</option>
                  <option value="long">Long (~1000 words)</option>
                </select>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select
                  value={options.style}
                  onChange={(e) => handleOptionChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="blog">Blog Post</option>
                  <option value="article">Article</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="review">Review</option>
                  <option value="news">News</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generate
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeTitle}
                      onChange={(e) => handleOptionChange('includeTitle', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Title</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeExcerpt}
                      onChange={(e) => handleOptionChange('includeExcerpt', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Excerpt</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeTags}
                      onChange={(e) => handleOptionChange('includeTags', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tags</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeCategory}
                      onChange={(e) => handleOptionChange('includeCategory', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Category</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="mb-6">
              <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Prompt (Optional)
              </label>
              <textarea
                id="customPrompt"
                value={options.customPrompt}
                onChange={(e) => handleOptionChange('customPrompt', e.target.value)}
                placeholder="Write a custom prompt for the AI... (Leave empty to use default prompt)"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePost}
              disabled={isGenerating || !options.topic.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="w-5 h-5 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generating with {AI_PROVIDERS[options.aiProvider]?.name}...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate with {AI_PROVIDERS[options.aiProvider]?.name}
                </>
              )}
            </button>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Generated Content</h2>
              <p className="text-gray-600">Review and customize your AI-generated post</p>
            </div>

            {!generatedContent ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p>Click "Generate Post" to create your AI-powered blog post</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Generated Title */}
                {generatedTitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={generatedTitle}
                      onChange={(e) => setGeneratedTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}

                {/* Generated Excerpt */}
                {generatedExcerpt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <textarea
                      value={generatedExcerpt}
                      onChange={(e) => setGeneratedExcerpt(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                    />
                  </div>
                )}

                {/* Generated Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y font-mono text-sm"
                  />
                </div>

                {/* Generated Tags and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedTags && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        value={generatedTags}
                        onChange={(e) => setGeneratedTags(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                  {generatedCategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={generatedCategory}
                        onChange={(e) => setGeneratedCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={regeneratePost}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={useGeneratedContent}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Use in Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 
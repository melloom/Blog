import { NextRequest, NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize AI clients
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || ''
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { text, generatePost, options } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    // If generating a post, use the specified AI provider
    if (generatePost && options) {
      const generatedPost = await generatePostWithAI(text, options)
      return NextResponse.json(generatedPost)
    }

    // Default to Cohere for text analysis
    const analysis = await analyzeTextWithCohere(text)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Text analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
}

async function generatePostWithAI(topic: string, options: any) {
  const { aiProvider, model, tone, length, style, customPrompt, includeTitle, includeExcerpt, includeTags, includeCategory } = options

  // Build the prompt
  let prompt = customPrompt || `Write a ${length} ${style} post about "${topic}" in a ${tone} tone.`
  
  if (includeTitle) {
    prompt += '\n\nPlease include a compelling title at the beginning.'
  }
  if (includeExcerpt) {
    prompt += '\n\nPlease include a brief excerpt/summary after the title.'
  }
  if (includeTags) {
    prompt += '\n\nPlease suggest relevant tags at the end.'
  }
  if (includeCategory) {
    prompt += '\n\nPlease suggest an appropriate category at the end.'
  }

  try {
    switch (aiProvider) {
      case 'openai':
        return await generateWithOpenAI(prompt, model)
      case 'gemini':
        return await generateWithGemini(prompt, model)
      case 'mistral':
        return await generateWithMistral(prompt, model)
      case 'huggingface':
        return await generateWithHuggingFace(prompt, model)
      default:
        return await generateWithCohere(prompt)
    }
  } catch (error) {
    console.error(`Error generating with ${aiProvider}:`, error)
    throw new Error(`Failed to generate post with ${aiProvider}`)
  }
}

async function generateWithOpenAI(prompt: string, model: string) {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional blog writer. Generate high-quality, engaging content that is well-structured and SEO-friendly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    const content = response.choices[0].message.content || ''
    
    // Parse the response to extract title, excerpt, content, tags, and category
    const parsed = parseGeneratedContent(content)
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags,
      category: parsed.category
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate with OpenAI')
  }
}

async function generateWithGemini(prompt: string, model: string) {
  try {
    const geminiModel = genAI.getGenerativeModel({ model: model })
    
    const result = await geminiModel.generateContent(prompt)
    const content = result.response.text()
    
    // Parse the response
    const parsed = parseGeneratedContent(content)
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags,
      category: parsed.category
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate with Gemini')
  }
}

async function generateWithMistral(prompt: string, model: string) {
  try {
    // Mistral AI API endpoint
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer. Generate high-quality, engaging content that is well-structured and SEO-friendly. Format your response with clear sections for title, excerpt, content, tags, and category.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1,
        random_seed: null,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Mistral API error response:', errorData)
      throw new Error(`Mistral API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    const parsed = parseGeneratedContent(content)
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags,
      category: parsed.category
    }
  } catch (error) {
    console.error('Mistral API error:', error)
    throw new Error('Failed to generate with Mistral')
  }
}

async function generateWithHuggingFace(prompt: string, model: string) {
  try {
    // Note: This would require Hugging Face Inference API
    // For now, we'll use a placeholder implementation
    
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('Hugging Face API request failed')
    }

    const data = await response.json()
    const content = Array.isArray(data) ? data[0].generated_text : data.generated_text
    
    const parsed = parseGeneratedContent(content)
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags,
      category: parsed.category
    }
  } catch (error) {
    console.error('Hugging Face API error:', error)
    throw new Error('Failed to generate with Hugging Face')
  }
}

async function generateWithCohere(prompt: string) {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      maxTokens: 2000,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    const content = response.generations[0].text.trim()
    const parsed = parseGeneratedContent(content)
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: parsed.tags,
      category: parsed.category
    }
  } catch (error) {
    console.error('Cohere API error:', error)
    throw new Error('Failed to generate with Cohere')
  }
}

function parseGeneratedContent(content: string) {
  // Simple parsing logic - you might want to improve this based on your needs
  const lines = content.split('\n').filter(line => line.trim())
  
  let title = ''
  let excerpt = ''
  let mainContent = ''
  let tags = ''
  let category = ''
  
  let currentSection = 'content'
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Try to identify sections
    if (trimmedLine.toLowerCase().includes('title:') || trimmedLine.toLowerCase().includes('# ')) {
      title = trimmedLine.replace(/^#\s*/, '').replace(/^title:\s*/i, '').trim()
      currentSection = 'title'
    } else if (trimmedLine.toLowerCase().includes('excerpt:') || trimmedLine.toLowerCase().includes('summary:')) {
      excerpt = trimmedLine.replace(/^excerpt:\s*/i, '').replace(/^summary:\s*/i, '').trim()
      currentSection = 'excerpt'
    } else if (trimmedLine.toLowerCase().includes('tags:') || trimmedLine.toLowerCase().includes('keywords:')) {
      tags = trimmedLine.replace(/^tags:\s*/i, '').replace(/^keywords:\s*/i, '').trim()
      currentSection = 'tags'
    } else if (trimmedLine.toLowerCase().includes('category:') || trimmedLine.toLowerCase().includes('category:')) {
      category = trimmedLine.replace(/^category:\s*/i, '').trim()
      currentSection = 'category'
    } else {
      // Add to main content if it's not a special section
      if (currentSection === 'content') {
        mainContent += (mainContent ? '\n\n' : '') + trimmedLine
      }
    }
  }
  
  // If no title was found, use the first line as title
  if (!title && lines.length > 0) {
    title = lines[0].trim()
    mainContent = lines.slice(1).join('\n\n').trim()
  }
  
  // If no excerpt was found, generate one from the first paragraph
  if (!excerpt && mainContent) {
    const firstParagraph = mainContent.split('\n\n')[0]
    excerpt = firstParagraph.length > 200 ? firstParagraph.substring(0, 200) + '...' : firstParagraph
  }
  
  return {
    title: title || 'Generated Post Title',
    excerpt: excerpt || 'Generated excerpt...',
    content: mainContent || content,
    tags: tags || 'technology, blog, ai',
    category: category || 'technology'
  }
}

async function analyzeTextWithCohere(text: string) {
  try {
    // Generate a compelling title
    const titleResponse = await cohere.generate({
      model: 'command',
      prompt: `Generate a compelling, SEO-friendly title for this blog post content. The title should be engaging, descriptive, and between 50-60 characters. Return only the title, nothing else.

Content: ${text.substring(0, 1000)}...`,
      maxTokens: 50,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    // Generate an excerpt/summary
    const excerptResponse = await cohere.generate({
      model: 'command',
      prompt: `Write a compelling excerpt/summary for this blog post. The excerpt should be 2-3 sentences long, engaging, and capture the main points. Return only the excerpt, nothing else.

Content: ${text.substring(0, 1500)}...`,
      maxTokens: 100,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    // Suggest relevant tags
    const tagsResponse = await cohere.generate({
      model: 'command',
      prompt: `Generate 5-8 relevant tags for this blog post. Tags should be single words or short phrases, separated by commas. Return only the tags, nothing else.

Content: ${text.substring(0, 1000)}...`,
      maxTokens: 50,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    // Suggest a category
    const categoryResponse = await cohere.generate({
      model: 'command',
      prompt: `Suggest the most appropriate category for this blog post from these options: technology, lifestyle, travel, food, health, business. Return only the category name, nothing else.

Content: ${text.substring(0, 1000)}...`,
      maxTokens: 20,
      temperature: 0.3,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    // Improve the content
    const improvedContentResponse = await cohere.generate({
      model: 'command',
      prompt: `Improve this blog post content by:
1. Fixing grammar and spelling
2. Improving sentence structure and flow
3. Making it more engaging and readable
4. Adding better transitions between paragraphs
5. Maintaining the original tone and message

Return the improved content only, nothing else.

Original content:
${text}`,
      maxTokens: 2000,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE'
    })

    return {
      title: titleResponse.generations[0].text.trim(),
      excerpt: excerptResponse.generations[0].text.trim(),
      tags: tagsResponse.generations[0].text.trim(),
      category: categoryResponse.generations[0].text.trim().toLowerCase(),
      improvedContent: improvedContentResponse.generations[0].text.trim(),
      originalLength: text.length,
      improvedLength: improvedContentResponse.generations[0].text.trim().length
    }
  } catch (error) {
    console.error('Cohere API error:', error)
    throw new Error('Failed to analyze text with Cohere')
  }
} 
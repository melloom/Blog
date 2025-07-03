interface ReadingTimeProps {
  content: string
  className?: string
}

export default function ReadingTime({ content, className = '' }: ReadingTimeProps) {
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    const readingTime = Math.ceil(words / wordsPerMinute)
    return readingTime
  }

  const readingTime = calculateReadingTime(content)

  return (
    <div className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {readingTime} min read
    </div>
  )
} 
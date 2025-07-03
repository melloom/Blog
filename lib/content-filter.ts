// Enhanced content filtering system for comments
// This system automatically approves most comments but flags inappropriate content

interface FilterResult {
  isApproved: boolean;
  reason?: string;
  flaggedWords?: string[];
  confidence: number; // 0-100, how confident we are this should be flagged
}

// Enhanced list of inappropriate words/phrases with categories
const INAPPROPRIATE_PATTERNS = {
  // High priority - immediate flag
  hate_speech: [
    'nazi', 'hitler', 'white supremacy', 'black supremacy', 'aryan',
    'antisemitic', 'islamophobic', 'homophobic', 'transphobic', 'sexist',
    'bigot', 'bigotry', 'discrimination', 'hate speech', 'racist',
    'kkk', 'neo-nazi', 'white power', 'black power'
  ],
  
  // Violence and threats
  violence: [
    'kill you', 'murder you', 'death threat', 'bomb threat', 'terrorist',
    'shoot you', 'gun threat', 'weapon threat', 'attack you', 'assault you',
    'beat you up', 'punch you', 'stab you', 'shoot up', 'bombing'
  ],
  
  // Spam patterns (more specific)
  spam: [
    'buy now', 'click here', 'free money', 'make money fast', 'work from home earn',
    'get rich quick', 'lottery winner', 'congratulations you won', 'prize winner',
    'viagra', 'cialis', 'weight loss pills', 'diet pills', 'casino bonus',
    'poker bonus', 'bitcoin investment', 'crypto investment', 'forex trading',
    'mlm opportunity', 'pyramid scheme', 'multi level marketing'
  ],
  
  // Adult content
  adult: [
    'porn', 'pornography', 'xxx', 'adult content', 'sex video',
    'nude', 'naked', 'strip', 'escort', 'prostitute'
  ],
  
  // Suspicious patterns
  suspicious: [
    'admin', 'moderator', 'spam', 'bot', 'test', 'fake',
    'clickbait', 'scam', 'fraud', 'phishing'
  ]
};

// Words that are often false positives (legitimate in context)
const LEGITIMATE_WORDS = [
  'work', 'home', 'money', 'free', 'help', 'support', 'love', 'hate',
  'kill' // in context like "kill time", "kill the lights"
];

// Context patterns that make certain words legitimate
const LEGITIMATE_CONTEXTS = [
  { word: 'kill', context: ['time', 'lights', 'boredom', 'pain', 'bacteria'] },
  { word: 'work', context: ['from', 'at', 'with', 'on', 'for'] },
  { word: 'home', context: ['at', 'from', 'to', 'work', 'school'] },
  { word: 'money', context: ['save', 'earn', 'spend', 'invest', 'donate'] }
];

export function filterComment(content: string, authorName: string): FilterResult {
  const lowerContent = content.toLowerCase();
  const lowerAuthorName = authorName.toLowerCase();
  const words = content.split(/\s+/);
  
  let flaggedWords: string[] = [];
  let confidence = 0;
  let reasons: string[] = [];
  
  // Check for inappropriate patterns by category
  for (const [category, patterns] of Object.entries(INAPPROPRIATE_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerContent.includes(pattern.toLowerCase())) {
        // Check if it's a legitimate context
        if (!isLegitimateContext(pattern, lowerContent)) {
          flaggedWords.push(pattern);
          
          // Adjust confidence based on category
          switch (category) {
            case 'hate_speech':
              confidence += 90;
              reasons.push('hate speech');
              break;
            case 'violence':
              confidence += 85;
              reasons.push('violence/threats');
              break;
            case 'spam':
              confidence += 70;
              reasons.push('spam');
              break;
            case 'adult':
              confidence += 80;
              reasons.push('adult content');
              break;
            case 'suspicious':
              confidence += 60;
              reasons.push('suspicious content');
              break;
          }
        }
      }
    }
  }
  
  // Check for excessive caps (more than 60% of content)
  const totalChars = content.length;
  const upperChars = content.replace(/[^A-Z]/g, '').length;
  const capsPercentage = (upperChars / totalChars) * 100;
  
  if (capsPercentage > 60 && totalChars > 15) {
    flaggedWords.push('excessive caps');
    confidence += 50;
    reasons.push('excessive capitalization');
  }
  
  // Check for excessive punctuation (more sophisticated)
  const exclamationCount = (content.match(/!/g) || []).length;
  const questionCount = (content.match(/\?/g) || []).length;
  const dotCount = (content.match(/\./g) || []).length;
  
  if (exclamationCount > 5 || questionCount > 5 || dotCount > 8) {
    flaggedWords.push('excessive punctuation');
    confidence += 40;
    reasons.push('excessive punctuation');
  }
  
  // Check for spam patterns (multiple URLs)
  const urlPattern = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlPattern) || [];
  
  if (urls.length > 2) {
    flaggedWords.push('multiple urls');
    confidence += 75;
    reasons.push('multiple URLs');
  }
  
  // Check for repetitive text (more sophisticated)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const repetitionRatio = uniqueWords.size / words.length;
  
  if (repetitionRatio < 0.4 && words.length > 15) {
    flaggedWords.push('repetitive text');
    confidence += 60;
    reasons.push('repetitive content');
  }
  
  // Check for very short or very long comments
  if (content.length < 5) {
    flaggedWords.push('too short');
    confidence += 30;
    reasons.push('comment too short');
  }
  
  if (content.length > 2000) {
    flaggedWords.push('too long');
    confidence += 20;
    reasons.push('comment too long');
  }
  
  // Check for suspicious author names
  const suspiciousNames = ['admin', 'moderator', 'spam', 'bot', 'test', 'fake'];
  if (suspiciousNames.some(name => lowerAuthorName.includes(name))) {
    flaggedWords.push('suspicious name');
    confidence += 40;
    reasons.push('suspicious author name');
  }
  
  // Check for rapid character repetition (like "aaaaaa" or "!!!!!!")
  const charRepetition = /(.)\1{4,}/g;
  if (charRepetition.test(content)) {
    flaggedWords.push('character repetition');
    confidence += 50;
    reasons.push('excessive character repetition');
  }
  
  // Check for gibberish (random character sequences)
  const gibberishPattern = /[a-z]{15,}/g;
  const gibberishMatches = content.match(gibberishPattern) || [];
  if (gibberishMatches.some(match => !isRealWord(match))) {
    flaggedWords.push('gibberish');
    confidence += 70;
    reasons.push('gibberish content');
  }
  
  // Check for excessive emojis
  const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = content.match(emojiPattern) || [];
  if (emojis.length > 8) {
    flaggedWords.push('excessive emojis');
    confidence += 30;
    reasons.push('excessive emojis');
  }
  
  // Determine final result based on confidence
  const isApproved = confidence < 50; // Only flag if confidence is 50% or higher
  
  return {
    isApproved,
    reason: isApproved ? undefined : `Content flagged for moderation: ${reasons.join(', ')}`,
    flaggedWords: isApproved ? undefined : [...new Set(flaggedWords)],
    confidence: Math.min(confidence, 100)
  };
}

// Helper function to check if a word is in legitimate context
function isLegitimateContext(word: string, content: string): boolean {
  const lowerWord = word.toLowerCase();
  
  // Check if it's in our legitimate words list
  if (LEGITIMATE_WORDS.includes(lowerWord)) {
    return true;
  }
  
  // Check for legitimate contexts
  for (const context of LEGITIMATE_CONTEXTS) {
    if (context.word === lowerWord) {
      return context.context.some(ctx => content.includes(ctx));
    }
  }
  
  return false;
}

// Simple function to check if a word looks like a real word
function isRealWord(word: string): boolean {
  // This is a simplified check - in a real implementation you might use a dictionary
  const vowels = 'aeiou';
  const hasVowels = vowels.split('').some(vowel => word.includes(vowel));
  const reasonableLength = word.length >= 3 && word.length <= 12;
  const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/.test(word);
  
  return hasVowels && reasonableLength && hasConsonants;
}

// Function to get moderation suggestions
export function getModerationSuggestions(content: string): string[] {
  const suggestions: string[] = [];
  
  if (content.length < 10) {
    suggestions.push('Comment is very short - consider adding more context');
  }
  
  if (content.length > 500) {
    suggestions.push('Comment is quite long - consider breaking it into multiple comments');
  }
  
  const capsPercentage = (content.replace(/[^A-Z]/g, '').length / content.length) * 100;
  if (capsPercentage > 30) {
    suggestions.push('Consider using fewer capital letters');
  }
  
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    suggestions.push('Consider using fewer exclamation marks');
  }
  
  return suggestions;
}

// Function to get a detailed analysis of a comment
export function analyzeComment(content: string, authorName: string): {
  filterResult: FilterResult;
  suggestions: string[];
  analysis: {
    length: number;
    capsPercentage: number;
    punctuationCount: number;
    urlCount: number;
    emojiCount: number;
  };
} {
  const filterResult = filterComment(content, authorName);
  const suggestions = getModerationSuggestions(content);
  
  const analysis = {
    length: content.length,
    capsPercentage: (content.replace(/[^A-Z]/g, '').length / content.length) * 100,
    punctuationCount: (content.match(/[!?.,;:]/g) || []).length,
    urlCount: (content.match(/https?:\/\/[^\s]+/g) || []).length,
    emojiCount: (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
  };
  
  return {
    filterResult,
    suggestions,
    analysis
  };
} 
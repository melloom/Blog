# AI Providers Setup Guide

This guide will help you set up the required API keys for the multiple AI providers supported in the blog.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Google Gemini
GEMINI_API_KEY="your-gemini-api-key"

# Mistral AI
MISTRAL_API_KEY="your-mistral-api-key"

# Hugging Face
HUGGINGFACE_API_KEY="your-huggingface-api-key"

# Anthropic Claude
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Cohere (existing)
COHERE_API_KEY="your-cohere-api-key"
```

## How to Get API Keys

### 1. OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local`

### 2. Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local`

### 3. Mistral AI
1. Go to [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create new key"
5. Copy the key and add it to your `.env.local`

### 4. Hugging Face
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to your profile settings
4. Navigate to "Access Tokens"
5. Click "New token"
6. Copy the token and add it to your `.env.local`

### 5. Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key and add it to your `.env.local`

### 6. Cohere (Already configured)
- Follow the existing Cohere setup if you haven't already

## Available Models

### OpenAI (6 models)
- **GPT-4o**: Latest model with improved performance ($0.005/1K tokens)
- **GPT-4o Mini**: Faster and more cost-effective ($0.00015/1K tokens)
- **GPT-4 Turbo**: Previous generation with good performance ($0.01/1K tokens)
- **GPT-4**: Original model with excellent reasoning ($0.03/1K tokens)
- **GPT-3.5 Turbo**: Reliable and fast ($0.0005/1K tokens)
- **GPT-3.5 Turbo 16K**: Extended context version ($0.003/1K tokens)

### Google Gemini (6 models)
- **Gemini 1.5 Pro**: Latest model with enhanced reasoning ($0.0035/1M tokens)
- **Gemini 1.5 Flash**: Fast and efficient ($0.000075/1M tokens)
- **Gemini 1.5 Pro Latest**: Most recent version ($0.0035/1M tokens)
- **Gemini 1.0 Pro**: Reliable model ($0.0005/1K tokens)
- **Gemini 1.0 Pro Vision**: Vision-enabled model ($0.0005/1K tokens)
- **Gemini 1.0 Flash**: Fast and lightweight ($0.000075/1K tokens)

### Mistral AI (8 models)
- **Mistral Large**: Latest reasoning-focused model (€0.14/1M tokens)
- **Mistral Medium**: Balanced performance (€0.24/1M tokens)
- **Mistral Small**: Fast and efficient (€0.14/1M tokens)
- **Mistral Large (Legacy)**: Previous version (€0.14/1M tokens)
- **Mistral Medium (Legacy)**: Previous version (€0.24/1M tokens)
- **Mistral Small (Legacy)**: Previous version (€0.14/1M tokens)
- **Open Mistral 7B**: Open-source model (Free self-hosted)
- **Open Mistral 8x7B**: Larger open-source model (Free self-hosted)

### Hugging Face (13 models)
- **Llama 3 8B Instruct**: Meta's latest open-source model (Free self-hosted)
- **Llama 3 70B Instruct**: Large-scale model for advanced tasks (Free self-hosted)
- **Llama 2 7B Chat**: Previous generation chat model (Free self-hosted)
- **Llama 2 13B Chat**: Larger chat model with better reasoning (Free self-hosted)
- **DialoGPT Medium**: Conversational AI model (Free self-hosted)
- **DialoGPT Large**: Larger conversational model (Free self-hosted)
- **DialoGPT Small**: Small conversational model (Free self-hosted)
- **GPT-2**: Classic text generation model (Free self-hosted)
- **GPT-2 Medium**: Medium-sized GPT-2 model (Free self-hosted)
- **GPT-2 Large**: Large GPT-2 model (Free self-hosted)
- **GPT-Neo 125M**: Small and fast model (Free self-hosted)
- **GPT-Neo 1.3B**: Medium-sized model (Free self-hosted)
- **GPT-Neo 2.7B**: Large model with excellent performance (Free self-hosted)

### Anthropic Claude (7 models)
- **Claude 3.5 Sonnet**: Latest model with enhanced reasoning ($3/1M input, $15/1M output)
- **Claude 3.5 Haiku**: Fast and efficient model ($0.25/1M input, $1.25/1M output)
- **Claude 3 Opus**: Most capable model for complex tasks ($15/1M input, $75/1M output)
- **Claude 3 Sonnet**: Balanced model with good performance ($3/1M input, $15/1M output)
- **Claude 3 Haiku**: Fast and lightweight model ($0.25/1M input, $1.25/1M output)
- **Claude 2.1**: Previous generation with good performance ($8/1M input, $24/1M output)
- **Claude 2.0**: Classic model with solid performance ($8/1M input, $24/1M output)

### Cohere (5 models)
- **Command R+**: Latest model with advanced reasoning ($0.003/1K tokens)
- **Command R**: Reliable model for text generation ($0.0005/1K tokens)
- **Command Light**: Fast and lightweight model ($0.0001/1K tokens)
- **Command**: Classic model with good performance ($0.001/1K tokens)
- **Command Nightly**: Experimental version with latest features ($0.001/1K tokens)

## Usage

1. Go to the AI Post Generator page in your admin dashboard
2. Select your preferred AI provider and model from the expanded options
3. Enter your topic and customize the generation options
4. Click "Generate Post" to create content with your chosen AI
5. Review and edit the generated content
6. Use "Use in Editor" to transfer the content to the manual editor

## Model Selection Tips

### For High-Quality Content:
- **OpenAI**: GPT-4o or GPT-4
- **Claude**: Claude 3.5 Sonnet or Claude 3 Opus
- **Gemini**: Gemini 1.5 Pro
- **Mistral**: Mistral Large

### For Cost-Effective Generation:
- **OpenAI**: GPT-4o Mini or GPT-3.5 Turbo
- **Claude**: Claude 3.5 Haiku
- **Gemini**: Gemini 1.5 Flash
- **Mistral**: Mistral Small
- **Cohere**: Command Light

### For Fast Responses:
- **OpenAI**: GPT-4o Mini
- **Claude**: Claude 3.5 Haiku
- **Gemini**: Gemini 1.5 Flash
- **Mistral**: Mistral Small
- **Cohere**: Command Light

### For Free Self-Hosting:
- **Hugging Face**: Any of the 13 available models
- **Mistral**: Open Mistral 7B or 8x7B

## Notes

- You only need to set up the API keys for the providers you want to use
- Some providers offer free tiers with usage limits
- Hugging Face and open Mistral models can be self-hosted for free
- The system will fall back to Cohere if other providers fail 
- Each provider has different pricing structures and capabilities
- Consider your use case when selecting models (quality vs. speed vs. cost) 
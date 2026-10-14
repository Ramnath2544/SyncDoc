# Google GenAI SDK - Quick Reference

## ✅ Correct Usage (Working)

### Import
```javascript
import { GoogleGenAI } from '@google/genai';
```

### Initialize
```javascript
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

### Generate Content (Streaming)
```javascript
const result = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
});

for await (const chunk of result) {
  const text = chunk.text;  // Property, not method
  console.log(text);
}
```

### Generate Content (Non-streaming)
```javascript
const response = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
});

console.log(response.text);
```

---

## ❌ Common Mistakes

### Mistake 1: Wrong Class Name
```javascript
❌ import { GoogleGenerativeAI } from '@google/genai';
✅ import { GoogleGenAI } from '@google/genai';
```

### Mistake 2: Wrong Package
```javascript
❌ import { GoogleGenAI } from '@google/generative-ai';
✅ import { GoogleGenAI } from '@google/genai';
```

### Mistake 3: Old Initialization
```javascript
❌ const genAI = new GoogleGenAI(apiKey);
✅ const genAI = new GoogleGenAI({ apiKey });
```

### Mistake 4: Trying to Get Model Separately
```javascript
❌ const model = genAI.models.get('gemini-2.0-flash');
❌ const result = await model.generateContentStream(prompt);

✅ const result = await genAI.models.generateContentStream({
     model: 'gemini-2.0-flash-exp',
     contents: prompt,
   });
```

### Mistake 5: Wrong Stream Processing
```javascript
❌ for await (const chunk of result.stream) {
     const text = chunk.text();
   }

✅ for await (const chunk of result) {
     const text = chunk.text;
   }
```

---

## 📋 Available Models

### Gemini 2.0 Models
- `gemini-2.0-flash-exp` - Fast, experimental (recommended)
- `gemini-2.0-flash-thinking-exp` - With reasoning
- `gemini-flash-latest` - Always latest flash model
- `gemini-pro-latest` - Always latest pro model

---

## 🔧 Configuration Options

### Basic Configuration
```javascript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
});
```

### With System Instructions
```javascript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
  systemInstruction: 'You are a helpful assistant...',
});
```

### With Safety Settings
```javascript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});
```

### With Generation Config
```javascript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: 'Your prompt here',
  config: {
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 40,
    },
  },
});
```

---

## 💡 Complete Working Example

```javascript
import { GoogleGenAI } from '@google/genai';

// Initialize
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Streaming function
async function streamAI(prompt) {
  try {
    const result = await genAI.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
        },
      },
    });

    let fullText = '';
    
    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        process.stdout.write(chunkText);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Non-streaming function
async function generateAI(prompt) {
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
(async () => {
  console.log('Streaming response:');
  await streamAI('Write a haiku about coding');
  
  console.log('\n\nNon-streaming response:');
  const result = await generateAI('What is JavaScript?');
  console.log(result);
})();
```

---

## 🛡️ Error Handling

```javascript
import { ApiError } from '@google/genai';

try {
  const result = await genAI.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: prompt,
  });
  
  console.log(result.text);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## 📚 Multi-turn Conversations

```javascript
// Using chat for conversations
const chat = genAI.chats.create({
  model: 'gemini-2.0-flash-exp',
});

// Send first message
let response = await chat.sendMessage('Hello! What is AI?');
console.log('AI:', response.text);

// Continue conversation
response = await chat.sendMessage('Can you explain more?');
console.log('AI:', response.text);

// Get history
console.log('History:', chat.history);
```

---

## 🎯 Key Points

### Always Remember:
1. ✅ Import `GoogleGenAI` (not GoogleGenerativeAI)
2. ✅ Initialize with object `{ apiKey }`
3. ✅ Call `genAI.models.generateContentStream()` directly
4. ✅ Pass `{ model, contents }` object
5. ✅ Iterate over `result` (not result.stream)
6. ✅ Access `chunk.text` as property (not method)

### SDK Version:
```json
{
  "@google/genai": "^2.29.1"
}
```

### Installation:
```bash
npm install @google/genai
```

---

## 🔗 Resources

- **Documentation:** https://googleapis.github.io/js-genai/
- **GitHub:** https://github.com/googleapis/js-genai
- **Samples:** https://github.com/googleapis/js-genai/tree/main/sdk-samples
- **API Reference:** https://ai.google.dev/api
- **Get API Key:** https://ai.google.dev/

---

## 📝 Environment Setup

### .env file
```env
GEMINI_API_KEY=your_api_key_here
```

### Load in Node.js
```javascript
import 'dotenv/config';
// or
import dotenv from 'dotenv';
dotenv.config();

// Then use
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

---

## ✅ Verification Checklist

Before deploying, verify:
- [ ] Using `@google/genai` package (not old package)
- [ ] Import `GoogleGenAI` (correct spelling)
- [ ] Initialize with `{ apiKey }` object
- [ ] Call methods on `genAI.models`
- [ ] Pass configuration object with `model` and `contents`
- [ ] Process stream correctly (no `.stream`, property access)
- [ ] Error handling in place
- [ ] API key in environment variables
- [ ] API key not exposed in client code

---

**Quick Reference Updated:** January 2025
**SDK Version:** 2.29.1
**Supported Models:** Gemini 2.0+

# Google Gemini SDK Migration Guide

## Overview

This document explains the migration from the legacy `@google/generative-ai` package to the new `@google/genai` SDK.

## Why Migrate?

The new Google GenAI SDK offers:
- ✅ Improved developer experience
- ✅ Updated client architecture
- ✅ Better TypeScript support
- ✅ Support for Gemini 2.0 features
- ✅ Simplified API surface
- ✅ Enhanced error handling
- ✅ Easier transition between developer and enterprise workflows

## Version Changes

### Before (Legacy SDK)
```json
{
  "@google/generative-ai": "^0.24.1"
}
```

### After (New SDK)
```json
{
  "@google/genai": "^2.29.1"
}
```

## Code Changes

### 1. Initialization

#### Before
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

#### After
```javascript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

**Changes:**
- Import `GoogleGenAI` instead of `GoogleGenerativeAI` (note: Gen not Generative)
- Constructor now accepts an object with `apiKey` property instead of string directly
- More extensible for future configuration options

### 2. Getting a Model

#### Before
```javascript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash' 
});
```

#### After
```javascript
// No need to get model separately
// Pass model directly to generateContent/generateContentStream
const result = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-exp',
  contents: prompt,
});
```

**Changes:**
- Model is specified directly in the generate method
- No separate model retrieval step needed

### 3. Streaming Content

#### Before
```javascript
const result = await model.generateContentStream(prompt);

for await (const chunk of result.stream) {
  const chunkText = chunk.text();  // Method call
  if (chunkText) {
    // Process chunk
  }
}
```

#### After
```javascript
const result = await model.generateContentStream(prompt);

for await (const chunk of result) {
  const chunkText = chunk.text;  // Property access
  if (chunkText) {
    // Process chunk
  }
}
```

**Changes:**
- Iterate directly over `result` instead of `result.stream`
- Access `chunk.text` as property instead of calling `chunk.text()`

## Complete Example: ai.controller.js

### Before Migration
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import Document from '../models/document.model.js';
import { errorHandler } from '../utils/error.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const streamAI = async (req, res, next) => {
  try {
    // ... validation code ...

    const prompt = "Your prompt here";

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    // Error handling
  }
};
```

### After Migration
```javascript
import { GoogleGenAI } from '@google/genai';
import Document from '../models/document.model.js';
import { errorHandler } from '../utils/error.js';

// Initialize with the new Google GenAI SDK
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const streamAI = async (req, res, next) => {
  try {
    // ... validation code ...

    const prompt = "Your prompt here";

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Using the latest Gemini 2.0 Flash model with the new SDK
    const result = await genAI.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    // Error handling
  }
};
```

## Migration Steps

### Step 1: Uninstall Old Package
```bash
cd api
npm uninstall @google/generative-ai
```

### Step 2: Install New Package
```bash
npm install @google/genai
```

### Step 3: Update Import Statements
Find all files importing the old SDK:
```bash
grep -r "@google/generative-ai" .
```

Update imports from:
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
```

To:
```javascript
import { GoogleGenAI } from '@google/genai';
```

**IMPORTANT:** Note it's `GoogleGenAI` not `GoogleGenerativeAI` in the new SDK!

### Step 4: Update Initialization
Change all instances of:
```javascript
new GoogleGenerativeAI(apiKey)
```

To:
```javascript
new GoogleGenAI({ apiKey })
```

**Note:** The class name changed from `GoogleGenerativeAI` to `GoogleGenAI`

### Step 5: Update Model Access
Change:
```javascript
genAI.getGenerativeModel({ model: 'model-name' })
```

To:
```javascript
genAI.models.generateContentStream({
  model: 'model-name',
  contents: prompt,
})
```

**Note:** No separate model.get() step needed

### Step 6: Update Streaming Logic
Change:
```javascript
for await (const chunk of result.stream) {
  const text = chunk.text();
}
```

To:
```javascript
const result = await genAI.models.generateContentStream({
  model: 'model-name',
  contents: prompt,
});

for await (const chunk of result) {
  const text = chunk.text;
}
```

### Step 7: Update Model Names
Update to latest model versions:
- `gemini-1.5-flash` → `gemini-2.0-flash`
- `gemini-1.5-pro` → `gemini-2.0-pro` (if applicable)

### Step 8: Test Thoroughly
Run your test suite and verify:
- ✅ AI streaming responses work correctly
- ✅ Error handling is working
- ✅ All AI features function as expected

## Available Models

### Gemini 2.0
- `gemini-2.0-flash` - Fast, optimized for speed
- `gemini-2.0-flash-exp` - Experimental features
- `gemini-2.0-pro` - Advanced reasoning (when available)

## Error Handling

The new SDK maintains similar error patterns, but with improved error messages:

```javascript
try {
  const model = genAI.models.get('gemini-2.0-flash');
  const result = await model.generateContentStream(prompt);
  // Process result
} catch (error) {
  console.error('Gemini API Error:', error.message);
  // Handle specific error types
  if (error.status === 429) {
    // Rate limit handling
  }
}
```

## Environment Variables

No changes needed for environment variables:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://ai.google.dev/

## Breaking Changes Summary

| Feature | Old SDK | New SDK |
|---------|---------|---------|
| Package | `@google/generative-ai` | `@google/genai` |
| Class Name | `GoogleGenerativeAI` | `GoogleGenAI` |
| Init | `new GoogleGenerativeAI(key)` | `new GoogleGenAI({ apiKey: key })` |
| Generate | `model.generateContentStream(prompt)` | `genAI.models.generateContentStream({ model, contents })` |
| Stream | `for await (chunk of result.stream)` | `for await (chunk of result)` |
| Text Access | `chunk.text()` | `chunk.text` |
| Model Name | `gemini-1.5-flash` | `gemini-2.0-flash-exp` |

## Additional Resources

- [Official Migration Guide](https://ai.google.dev/gemini-api/docs/migrate)
- [New SDK Documentation](https://googleapis.github.io/js-genai/)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [API Reference](https://ai.google.dev/api)

## Support

If you encounter issues:
1. Check the [official documentation](https://googleapis.github.io/js-genai/)
2. Review [migration examples](https://ai.google.dev/gemini-api/docs/migrate)
3. Open an issue with error details
4. Contact support: ramnath2544@gmail.com

## Notes

- The new SDK requires Node.js 18+
- All Gemini 1.5 features are available in 2.0
- TypeScript types are significantly improved
- Performance is comparable or better
- API rate limits remain the same

---

**Migration completed! ✨**

Your SyncDoc application now uses the latest Google GenAI SDK with Gemini 2.0.

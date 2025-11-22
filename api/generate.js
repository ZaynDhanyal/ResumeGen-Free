import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key exists
  // Priority: API_KEY (Recommended), then GEMINI_API_KEY (Fallback)
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('API Key is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: API Key missing' 
    });
  }

  try {
    const { model, contents, config } = req.body;

    if (!contents) {
      return res.status(400).json({ error: 'Contents/prompt is required' });
    }

    // Initialize Gemini with @google/genai
    const ai = new GoogleGenAI({ apiKey });
    
    // Use the model from request or default to gemini-2.5-flash for basic text tasks
    const modelName = model || 'gemini-2.5-flash';

    // Generate content using the new API signature
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    const text = response.text;

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
}
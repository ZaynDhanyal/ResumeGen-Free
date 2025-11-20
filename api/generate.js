import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('API Key not found in environment variables');
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  try {
    const { model, contents, config } = req.body;
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Use the requested model or default to flash
    const modelName = model || 'gemini-2.5-flash';

    const result = await ai.models.generateContent({
      model: modelName,
      contents,
      config
    });

    return res.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
}

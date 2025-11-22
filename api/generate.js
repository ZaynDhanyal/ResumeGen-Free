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
    
    // Default to flash-lite for speed
    const modelName = model || 'gemini-2.5-flash-lite';
    
    // Direct REST API URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // Format the payload for the REST API
    // The client sends `contents` as a string (the prompt)
    const requestBody = {
        contents: [{ parts: [{ text: contents }] }]
    };

    // Map client config to generationConfig
    if (config) {
        requestBody.generationConfig = config;
    }

    // Perform lightweight fetch instead of loading heavy SDK
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        // Fallback logic: if 2.5-flash-lite fails (e.g. not available in region), try 1.5-flash
        if (modelName === 'gemini-2.5-flash-lite' && response.status === 404) {
             console.log('Retrying with gemini-1.5-flash...');
             const retryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
             const retryResponse = await fetch(retryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
             });
             if (retryResponse.ok) {
                 const retryData = await retryResponse.json();
                 const retryText = retryData.candidates?.[0]?.content?.parts?.[0]?.text;
                 return res.status(200).json({ text: retryText || '' });
             }
        }
        
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
}
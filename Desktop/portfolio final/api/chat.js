/**
 * Vercel Serverless Function: Gemini AI Chatbot Proxy
 * Endpoint: /api/chat
 * 
 * This function:
 * 1. Receives chat messages from the frontend
 * 2. Calls Google Gemini API to generate responses
 * 3. Returns the response with proper error handling
 * 
 * Environment: GEMINI_API_KEY (set in Vercel environment variables)
 */

const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

/**
 * Convert frontend message format to Gemini format:
 * Frontend: {role:'user'|'assistant', content:string}[]
 * Gemini:   {role:'user'|'model', parts:[{text}]}[]
 */
function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

/**
 * Main handler function
 */
module.exports = (req, res) => {
  // Enable CORS for same-origin requests (Vercel domain)
  // No need for restrictive CORS on Vercel since frontend and API are same-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validate API key
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid request: missing messages array' });
      return;
    }

    // Build Gemini API request payload
    const geminiPayload = JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: toGeminiContents(messages),
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.4,
      },
    });

    const path = `/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(geminiPayload),
      },
    };

    // Make request to Gemini API
    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';

      proxyRes.on('data', (chunk) => {
        data += chunk;
      });

      proxyRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          // Handle API errors
          if (parsed.error) {
            const status = parsed.error.status;
            let friendlyMessage = 'I\'m a bit busy right now — try again in a moment!';

            if (status === 'UNAUTHENTICATED' || status === 'PERMISSION_DENIED') {
              friendlyMessage = 'I\'m having trouble with my credentials. Please try again later.';
            } else if (status === 'INVALID_ARGUMENT') {
              friendlyMessage = 'I couldn\'t understand that request. Please try again.';
            }

            res.status(200).json({ content: friendlyMessage });
            return;
          }

          // Extract response from Gemini
          const content =
            parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
            'Sorry, I couldn\'t generate a response. Please try again!';

          res.status(200).json({ content });
        } catch (parseError) {
          console.error('Failed to parse Gemini response:', parseError);
          res.status(200).json({
            content: 'I\'m a bit busy right now — try again in a moment!',
          });
        }
      });
    });

    proxyReq.on('error', (error) => {
      console.error('Gemini API request failed:', error);
      res.status(200).json({
        content: 'I\'m a bit busy right now — try again in a moment!',
      });
    });

    proxyReq.write(geminiPayload);
    proxyReq.end();
  } catch (error) {
    console.error('Handler error:', error);
    res.status(200).json({
      content: 'I\'m a bit busy right now — try again in a moment!',
    });
  }
}

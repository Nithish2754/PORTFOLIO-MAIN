// Node.js proxy server for the Google Gemini API chatbot endpoint.
// Run with: node server/chat.js
// Set GEMINI_API_KEY in your .env before starting.
// Get a free key at: https://aistudio.google.com → "Get API key" (no billing needed)

import 'dotenv/config';
import http from 'http';
import https from 'https';

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash'; // Free tier · swap to gemini-2.5-flash-lite for higher volume

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Convert the frontend's {role:'user'|'assistant', content:string}[] history
 * into Gemini's {role:'user'|'model', parts:[{text}]}[] format.
 */
function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

const server = http.createServer((req, res) => {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { messages, system } = JSON.parse(body);

        if (!GEMINI_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ error: 'GEMINI_API_KEY not set. Add it to your .env file.' }),
          );
          return;
        }

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

        const proxyReq = https.request(options, (proxyRes) => {
          let data = '';
          proxyRes.on('data', (chunk) => (data += chunk));
          proxyRes.on('end', () => {
            try {
              const parsed = JSON.parse(data);

              // Surface rate-limit / quota errors as friendly messages
              if (parsed.error) {
                const status = parsed.error.status;
                let friendly =
                  status === 'RESOURCE_EXHAUSTED'
                    ? "I'm a bit busy right now — try again in a moment!"
                    : 'Something went wrong on my end. Please try again!';
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ content: friendly }));
                return;
              }

              const content =
                parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
                "Sorry, I couldn't generate a response. Please try again!";

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ content }));
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to parse Gemini response.' }));
            }
          });
        });

        proxyReq.on('error', () => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to reach Gemini API.' }));
        });

        proxyReq.write(geminiPayload);
        proxyReq.end();
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body.' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`✓ Gemini chatbot proxy running at http://localhost:${PORT}`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  POST http://localhost:${PORT}/api/chat`);
});

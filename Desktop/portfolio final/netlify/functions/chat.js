/**
 * Netlify Function: Gemini AI Chatbot Proxy
 * Endpoint: /.netlify/functions/chat (aliased as /api/chat via netlify.toml)
 * 
 * This function:
 * 1. Receives chat messages from the frontend
 * 2. Calls Google Gemini API to generate responses
 * 3. Returns the response with proper error handling
 * 
 * Environment: GEMINI_API_KEY (set in Netlify dashboard)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

// Resume context for chatbot system instruction
const RESUME_CONTEXT = `You are Nithish's AI assistant, providing information from his portfolio and resume.

EDUCATION:
- Sri Sairam Institute of Technology, Chennai, India
- B.Tech in Information Technology
- Expected Graduation: May 2026
- CGPA: 8.74/10
- Relevant Coursework: Data Structures, Web Development, Database Management, Cloud Computing

EXPERIENCE:
1. Laya Tech (June 15-29, 2026)
   - Role: Full Stack Developer Intern
   - Achievements:
     * Built CyberLens - a phishing threat verification platform
     * Implemented FastAPI backend services with async operations
     * Developed React frontend with responsive design
     * Architected multi-service backend integrating 90+ security engines
     * Integrated Google Gemini AI for intelligent phishing detection
     * Implemented VirusTotal and Google Safe Browsing APIs

2. Sri Sairam Institute R&D (Dec 2025 - Jan 2026)
   - Role: Cloud Infrastructure Intern
   - Achievements:
     * Deployed applications on Azure cloud platform
     * Configured CI/CD pipelines for automated deployments
     * Implemented monitoring and scaling strategies
     * Worked with containerization technologies

SKILLS:
- Languages: JavaScript, TypeScript, Python, Java, SQL, HTML, CSS
- Frontend: React, Tailwind CSS, Framer Motion, Vite
- Backend: FastAPI, Node.js, Express.js
- Cloud/DevOps: Azure, Docker, GitHub Actions
- APIs: Gemini API, VirusTotal, Google Safe Browsing, REST APIs
- Databases: PostgreSQL, MongoDB
- Tools: Git, VS Code, Postman, Figma

PROJECTS:
1. CyberLens - Phishing Threat Verification (Featured)
   - Full-stack application integrating 90+ security engines
   - FastAPI backend with async operations
   - React frontend with intuitive UI
   - Google Gemini AI for intelligent threat analysis
   - Integrated VirusTotal and Google Safe Browsing
   - Orchestrated multiple security APIs for comprehensive verification
   GitHub: https://github.com/Nithish2754/PHISHGUARD

2. Portfolio Website
   - Personal portfolio with animated components
   - Built with React, TypeScript, Tailwind CSS
   - Features: Chatbot, project showcase, experience timeline
   - Mobile-responsive design

3. Cloud Deployment Project
   - Deployed full-stack application on Azure
   - Configured CI/CD with GitHub Actions
   - Implemented auto-scaling and monitoring

CERTIFICATIONS:
- Microsoft Azure Fundamentals (AZ-900)
- Google Cloud Associate Cloud Engineer

SOFT SKILLS:
- Quick learner with strong problem-solving abilities
- Team collaboration and communication
- Project management and time management
- Passionate about cybersecurity and cloud technologies

Feel free to ask me about Nithish's skills, experience, projects, or anything else from his portfolio!`;

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
 * Main Netlify handler function
 */
exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate API key
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ content: 'Server configuration error' }),
    };
  }

  try {
    const { messages, system } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request: missing messages array' }),
      };
    }

    // Build Gemini API request payload
    const geminiPayload = {
      systemInstruction: { parts: [{ text: system || RESUME_CONTEXT }] },
      contents: toGeminiContents(messages),
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.4,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    const data = await response.json();

    // Handle API errors
    if (data.error) {
      const status = data.error.status;
      let friendlyMessage = 'I\'m a bit busy right now — try again in a moment!';

      if (status === 'UNAUTHENTICATED' || status === 'PERMISSION_DENIED') {
        friendlyMessage = 'I\'m having trouble with my credentials. Please try again later.';
      } else if (status === 'INVALID_ARGUMENT') {
        friendlyMessage = 'I couldn\'t understand that request. Please try again.';
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ content: friendlyMessage }),
      };
    }

    // Extract response from Gemini
    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Sorry, I couldn\'t generate a response. Please try again!';

    return {
      statusCode: 200,
      body: JSON.stringify({ content }),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: 'I\'m a bit busy right now — try again in a moment!',
      }),
    };
  }
};

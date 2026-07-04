export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  bullets: string[];
  caseStudy?: {
    problem: string;
    approach: string;
    role: string;
    techStack: string;
    outcome: string;
  };
  tags: string[];
  github?: string;
  featured?: boolean;
}

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

// ─── SKILLS ─────────────────────────────────────────────────────────────────
export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: ['Python', 'Java'],
  },
  {
    category: 'Frontend',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'],
  },
  {
    category: 'Backend',
    skills: ['FastAPI', 'Node.js'],
  },
  {
    category: 'Database & Tools',
    skills: ['MySQL', 'Git', 'GitHub', 'VS Code'],
  },
  {
    category: 'Core Concepts',
    skills: ['OOP', 'Data Structures', 'Problem Solving'],
  },
];

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
export const experience: ExperienceEntry[] = [
  {
    role: 'Cyber Security Intern',
    org: 'Laya Tech Pvt Ltd',
    period: 'June 15 – June 29, 2026',
    bullets: [
      'Built CyberLens, a full-stack cybersecurity threat analyzer, as the core internship deliverable.',
      'Implemented FastAPI backend services integrating VirusTotal, Google Safe Browsing, and Gemini AI APIs for multi-source threat detection.',
      'Developed React frontend with Tailwind CSS and Framer Motion for real-time threat scoring and interactive UI components.',
      'Architected multi-service backend layer orchestrating URL/email analysis against 90+ security engines with AI-powered threat assessment.',
    ],
  },
  {    role: 'R&D Intern',
    org: 'Sri Sairam Techno Incubation Center',
    period: 'Dec 2025 – Jan 2026',
    bullets: [
      'Developed responsive web interfaces using HTML, CSS, JavaScript, and React.js.',
      'Applied component-based UI development principles across multiple modules.',
      'Assisted in building interactive, user-friendly web pages with polished UX.',
      'Gained practical experience in frontend workflows, debugging, and UI design.',
    ],
  },
];

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 'civicbridge',
    title: 'CivicBridge',
    shortDesc: 'AI-Powered Civic Engagement Platform',
    bullets: [],
    caseStudy: {
      problem: "Citizens often don't report civic/infrastructure issues (broken roads, water leaks, etc.) because traditional reporting channels are inconvenient, text-heavy, or inaccessible to people who aren't comfortable typing detailed reports.",
      approach: "Built a platform where citizens can report issues by voice instead of text, lowering the barrier to civic participation. Speech input is converted into structured issue data automatically, and the platform supports multiple languages to make it genuinely accessible.",
      role: "Designed and built the backend REST API layer in FastAPI, integrated AWS services (DynamoDB for data storage, S3 for file/media storage, Lambda for serverless processing, Cognito for authentication), and worked on the accessibility-focused frontend.",
      techStack: "FastAPI, AWS DynamoDB, AWS S3, AWS Lambda, AWS Cognito, Speech-to-Text AI, React",
      outcome: "This project pushed me to think about accessibility as a core requirement, not a feature — designing for users who may not be comfortable with text-heavy interfaces changed how I think about UI decisions. It also gave me real experience architecting a multi-service AWS backend rather than a single monolithic API."
    },
    tags: ['FastAPI', 'AWS', 'Speech-to-Text', 'React'],
    featured: true,
  },
  {
    id: 'cyberlens',
    title: 'CyberLens',
    shortDesc: 'AI-Powered Cybersecurity Threat Analyzer',
    bullets: [],
    caseStudy: {
      problem: "Phishing attacks and malicious URLs are widespread cybersecurity threats — users need a quick, reliable way to verify if a URL or email is safe before interacting with it. Traditional manual analysis is slow and error-prone.",
      approach: "Built a full-stack application that analyzes URLs and emails against 90+ security engines (VirusTotal + Google Safe Browsing APIs), combined with Gemini AI for intelligent threat assessment. The system provides real-time threat scoring (0-100) and AI-powered explanations of detected threats.",
      role: "Full-stack developer — architected and implemented the FastAPI backend services (VirusTotal integration, Google Safe Browsing API, Gemini AI threat analysis, threat scoring logic) and developed the React frontend UI (threat gauge visualization, result cards, scan history, responsive design).",
      techStack: "Backend: FastAPI, Python, HTTPX. Frontend: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios. APIs: VirusTotal v3, Google Safe Browsing v4, Gemini 1.5 Flash. Storage: localStorage.",
      outcome: "Created an end-to-end cybersecurity application with real-time threat intelligence from multiple sources. This project taught me how to orchestrate multiple third-party APIs, handle async operations efficiently, and build accessible security-focused UI that communicates complex threat data clearly to users."
    },
    tags: ['FastAPI', 'React', 'Gemini AI', 'VirusTotal', 'Cybersecurity'],
    github: 'https://github.com/Nithish2754/PHISHGUARD',
    featured: true,
  },
  {
    id: 'devlens',
    title: 'DevLens',
    shortDesc: 'GitHub Repo Search & AI Analysis Engine',
    bullets: [],
    caseStudy: {
      problem: "[PENDING] What problem does this search/analysis engine solve for developers?",
      approach: "Searches public GitHub repos with intelligent ranking. Uses AI for technology detection, summaries, and topic classification.",
      role: "[PENDING] What was your specific role in building this?",
      techStack: "FastAPI, React, Gemini AI, Docker, Developer Tools",
      outcome: "[PENDING] What was the key outcome or learning from this project?"
    },
    tags: ['FastAPI', 'React', 'Gemini AI', 'Docker', 'Developer Tools'],
    github: 'https://github.com/Nithish2754/devlens',
    featured: true,
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Website',
    shortDesc: 'Full-Stack Shopping Platform',
    bullets: [],
    caseStudy: {
      problem: "Built during my internship at Sri Sairam Techno Incubation Center as a full-stack exercise in building a production-style commerce flow, not a toy CRUD app.",
      approach: "Implemented complete user flows — registration/login, browsing and managing products, cart management, and a secure checkout process — mirroring how a real e-commerce platform is structured.",
      role: "Full-stack contributor — built both frontend interfaces and backend logic for authentication, cart state, and checkout.",
      techStack: "JavaScript, React, Node.js/backend auth, cart & checkout logic",
      outcome: "This was where I first worked with authentication and state management at a level closer to production than coursework projects — handling edge cases like cart persistence and checkout validation taught me a lot about the details that separate a working demo from a usable product."
    },
    tags: ['JavaScript', 'Full Stack', 'Auth', 'Checkout'],
    github: 'https://github.com/Nithish2754/E-COMMERCE-WEBSITE-',
  },
];

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────
export const certifications = [
  'MERN Full Stack Development Revamp',
  'The Joy of Computing using Python',
];

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
export const achievements = [
  {
    icon: '🏆',
    title: '2nd Place — PredictG Machine Learning Event',
    detail:
      'Talos 5.0 National Level Symposium, Chennai Institute of Technology · ₹2000 cash prize',
  },
];

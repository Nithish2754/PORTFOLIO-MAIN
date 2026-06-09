import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchRepos = (query, language = '', sort = 'stars', page = 1) =>
  client.get('/search', {
    params: { q: query, language, sort, page }
  });

export const analyzeRepo = (owner, repo, description = '') =>
  client.post('/analyze', { owner, repo, description });

export const getTrending = () =>
  client.get('/trending');

export const recommendSimilar = (targetRepo, availableRepos, topN = 5) =>
  client.post('/recommend', {
    target_repo: targetRepo,
    available_repos: availableRepos,
    top_n: topN
  });

export const chatWithRepo = (owner, repo, readme, message, history = []) =>
  client.post('/chat', {
    owner,
    repo,
    readme,
    message,
    conversation_history: history
  });

export const matchResume = (resumeText, repos) =>
  client.post('/resume-match', {
    resume_text: resumeText,
    repos
  });

export default client;

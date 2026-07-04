import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { RESUME_CONTEXT } from '../data/resumeContext';
import MagneticButton from './MagneticButton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_CHIPS = [
  'What projects has he built?',
  'What are his technical skills?',
  'Tell me about his internship',
  'How do I contact him?',
  'What are his achievements?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3" aria-label="Assistant is typing" aria-live="polite">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  // Listen for command palette event
  useEffect(() => {
    const handleOpenChatbot = () => {
      setOpen(true);
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        '/api/chat',
        {
          messages: newMessages,
          system: RESUME_CONTEXT,
        },
        { timeout: 25000 },
      );
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.data.content ?? res.data.message ?? 'Sorry, I couldn\'t process that.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("I'm a bit busy right now — try again in a moment!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Launcher button */}
      <div className="chat-launcher" role="complementary" aria-label="AI chatbot">
        {/* Pulse ring */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full bg-accent-cyan animate-pulse-ring"
            aria-hidden="true"
          />
        )}
        <MagneticButton
          as={motion.button}
          id="chatbot-launcher"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full bg-accent-cyan text-bg-base flex items-center justify-center shadow-glow-cyan font-mono text-xl font-bold z-10"
          aria-label={open ? 'Close AI chatbot' : 'Open AI chatbot'}
          aria-expanded={open}
          aria-controls="chatbot-panel"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span aria-hidden="true">&gt;_</span>
          )}
        </MagneticButton>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chatbot-panel"
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] max-w-sm z-40 flex flex-col"
            style={{ height: 'min(520px, calc(100vh - 140px))' }}
            role="dialog"
            aria-modal="true"
            aria-label="AI chatbot panel"
          >
            <div
              className="flex flex-col h-full overflow-hidden border border-border-dim"
              style={{
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface)',
                boxShadow: '0 4px 48px #0008, 0 0 32px #2de2c715',
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-border-dim bg-bg-elevated"
                style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
              >
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-accent-red" />
                  <span className="w-3 h-3 rounded-full bg-accent-amber" />
                  <span className="w-3 h-3 rounded-full bg-accent-cyan" />
                </div>
                <span className="font-mono text-xs text-text-muted flex-1 text-center">
                  nithish-ai — assistant
                </span>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {/* Welcome message */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex gap-2.5 items-start">
                      <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-xs font-mono text-accent-cyan shrink-0">
                        AI
                      </div>
                      <div
                        className="text-sm text-text-muted leading-relaxed px-4 py-3"
                        style={{ background: 'var(--bg-elevated)', borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)' }}
                      >
                        Hi! I'm Nithish's AI assistant. Ask me anything about his projects, skills,
                        or experience. 👋
                      </div>
                    </div>

                    {/* Quick chips — smaller, more spacing */}
                    <div className="flex flex-wrap gap-2.5 mt-4 ml-9">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-border-dim text-text-muted hover:border-accent-cyan hover:text-accent-cyan transition-all font-mono leading-snug"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Message bubbles */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-xs font-mono text-accent-cyan shrink-0">
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div
                      className={`text-sm leading-relaxed px-4 py-3 max-w-[80%] ${
                        msg.role === 'user'
                          ? 'bg-accent-cyan/15 text-text-primary'
                          : 'text-text-muted'
                      }`}
                      style={{
                        borderRadius: msg.role === 'user'
                          ? 'var(--radius-md) 0 var(--radius-md) var(--radius-md)'
                          : '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                        ...(msg.role === 'assistant' ? { background: 'var(--bg-elevated)' } : {}),
                      }}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-xs font-mono text-accent-cyan shrink-0">
                      AI
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)' }}>
                      <TypingDots />
                    </div>
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-accent-red font-mono text-center py-2"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input — same height for field and button */}
              <form
                onSubmit={handleSubmit}
                className="p-3 border-t border-border-dim flex items-center gap-2"
                aria-label="Chat input form"
              >
                <input
                  ref={inputRef}
                  id="chatbot-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Nithish..."
                  disabled={loading}
                  className="flex-1 bg-bg-base border border-border-dim h-9 px-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-cyan transition-colors font-mono disabled:opacity-50"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  aria-label="Chat message input"
                />
                <button
                  id="chatbot-send"
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center h-9 w-9 bg-accent-cyan text-bg-base font-bold text-sm disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shrink-0"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

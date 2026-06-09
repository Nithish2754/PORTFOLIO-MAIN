import { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { chatWithRepo } from '../api/client';

export default function RepoChat({ repo, readme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithRepo(
        repo.owner,
        repo.name,
        readme,
        input,
        messages
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error sending message. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 rounded-3xl border border-slate-800 bg-slate-900/95 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            Ask questions about this repository...
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-800 px-4 py-2">
              <Loader className="animate-spin text-cyan-300" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-800 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this repo..."
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw,
  Sparkles, Paperclip, X, MessageSquare, Trash2, Search, Pin,
  Clock, ChevronDown, PanelRightOpen, PanelRightClose
} from "lucide-react";
import { api } from "../services/api.js";
import Button from "./Button.jsx";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

function Message({ msg, onCopy, copiedId }) {
  const isUser = msg.role === "user";
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? "bg-indigo-100 text-indigo-600" : "bg-gradient-to-br from-primary to-accent text-white"
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`group max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-tr-md"
            : "bg-white border border-slate-100 shadow-sm rounded-tl-md"
        }`}>
          {msg.content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onCopy(msg.content)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => setLiked(!liked)} className={`p-1 rounded hover:bg-slate-100 ${liked ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}>
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setDisliked(!disliked)} className={`p-1 rounded hover:bg-slate-100 ${disliked ? "text-red-500" : "text-slate-400 hover:text-slate-600"}`}>
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SuggestionChip({ text, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap"
    >
      <Sparkles className="h-3.5 w-3.5" />
      {text}
    </button>
  );
}

export default function AiChat({ agent = "mentor", context = {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [conversations, setConversations] = useState([
    { id: "1", title: "Career Planning", preview: "How do I become a full stack developer?", date: "Today" },
    { id: "2", title: "Resume Review", preview: "Can you review my resume?", date: "Yesterday" },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const suggestions = [
    "Help me plan my career path",
    "Review my resume",
    "Prepare for an interview",
    "What skills should I learn?",
    "Create a study plan",
    "Recommend certifications",
  ];

  async function sendMessage(text) {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/mentor-chat", {
        message: messageText,
        agent,
        context,
        history: messages.slice(-10),
      });
      const aiMsg = { id: Date.now() + 1, role: "assistant", content: data.data?.answer || data.data || "I'm here to help you with your career journey!" };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: getFallbackResponse(messageText, agent),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }

  function getFallbackResponse(query, agentType) {
    const responses = {
      career: "Based on your profile, I recommend exploring Full Stack Development or AI Engineering. These fields have strong growth and competitive salaries. Would you like a detailed roadmap?",
      resume: "I've analyzed your resume. Key improvements: add measurable achievements, include role-specific keywords, and move projects above certifications. Your ATS score could improve by 15% with these changes.",
      interview: "For interview prep, focus on: 1) Core fundamentals in your domain, 2) Project deep-dive explanations, 3) Behavioral questions using STAR format. Would you like company-specific questions?",
      coding: "Let's practice! Here's a challenge: Write a function to find the longest substring without repeating characters. Try solving it, then I'll review your approach.",
      learning: "I recommend starting with our Full Stack Web Development course. It covers HTML/CSS, JavaScript, React, Node.js, and databases. Complete it to earn your certificate!",
      certification: "For your career goals, I recommend: AWS Certified Developer, Google Professional Cloud Architect, or Microsoft Azure certifications. Each takes 2-3 months of preparation.",
      planner: "Here's your 30-day plan: Week 1-2: Complete JavaScript fundamentals. Week 3: Build a React project. Week 4: Deploy and practice interviews. Ready to start?",
      analytics: "Your progress: 3 courses completed, 2 certificates earned, 85% skill mastery. You're on track for your career goals. Keep up the great work!",
    };
    return responses[agentType] || responses.mentor || "I'm your AI career assistant. I can help with career planning, resume review, interview prep, coding practice, and more. What would you like to explore?";
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopiedId(Date.now());
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function newChat() {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:block overflow-hidden"
          >
            <div className="w-[280px] h-full bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700 truncate">{conv.title}</h4>
                      <span className="text-xs text-slate-400">{conv.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{conv.preview}</p>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100">
                <Button variant="outline" size="sm" className="w-full" onClick={newChat}>
                  <MessageSquare className="h-4 w-4" /> New Chat
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            >
              {showHistory ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Nexa AI Assistant</h3>
              <p className="text-xs text-slate-400">Powered by Multi-Agent System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={newChat} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" title="New chat">
              <MessageSquare className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" title="Clear chat">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">How can I help you today?</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                I'm your AI career assistant. Ask me about career paths, resume review, interview prep, coding practice, or anything else!
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
                {suggestions.map((s) => (
                  <SuggestionChip key={s} text={s} onClick={sendMessage} />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} onCopy={handleCopy} copiedId={copiedId} />
            ))}
          </AnimatePresence>

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 shrink-0">
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-slate-800 placeholder-slate-400 py-2 max-h-32"
              rows={1}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            Nexa AI may produce inaccurate information. Verify important facts.
          </p>
        </div>
      </div>
    </div>
  );
}
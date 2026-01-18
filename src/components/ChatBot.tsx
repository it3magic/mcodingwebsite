"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, ChevronDown, Sparkles, RotateCcw } from "lucide-react";
import { trackWhatsAppClick } from "@/components/GoogleAnalytics";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  buttons?: { label: string; action: string; isPrimary?: boolean }[];
  source?: "ai" | "fallback" | "error";
}

interface StoredMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  buttons?: { label: string; action: string; isPrimary?: boolean }[];
  source?: "ai" | "fallback" | "error";
}

interface ChatStorage {
  messages: StoredMessage[];
  conversationHistory: {role: string; content: string}[];
  sessionId: string;
  lastActivity: number;
}

// Storage keys
const CHAT_STORAGE_KEY = "mcoding_chat_history";
const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

// Generate unique session ID
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Quick action buttons for the chat
const quickActions = [
  { label: "Service Packages", query: "I'm looking to get my car serviced" },
  { label: "ZF Transmission", query: "I need a ZF transmission service" },
  { label: "Apple CarPlay", query: "I'm interested in Apple CarPlay activation" },
  { label: "Location & Hours", query: "Where are you located and what are your opening hours?" },
];

// Parse inline buttons from AI response {{BUTTON:Label|url}}
const parseInlineButtons = (text: string): { cleanText: string; buttons: { label: string; action: string }[] } => {
  const buttonRegex = /\{\{BUTTON:([^|]+)\|([^}]+)\}\}/g;
  const buttons: { label: string; action: string }[] = [];
  let cleanText = text;

  let match;
  while ((match = buttonRegex.exec(text)) !== null) {
    buttons.push({
      label: match[1].trim(),
      action: match[2].trim()
    });
  }

  // Remove button markers from text
  cleanText = text.replace(buttonRegex, '').trim();

  // Remove markdown-style links [text](url)
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove bare URLs (http/https)
  cleanText = cleanText.replace(/https?:\/\/[^\s]+/g, '');

  // Remove any leftover /products/... or /blog/... paths
  cleanText = cleanText.replace(/\/(?:products|blog|services)\/[^\s\.,!?]+/g, '');

  // Clean up any double line breaks or extra spaces left behind
  cleanText = cleanText.replace(/\n{3,}/g, '\n\n');
  cleanText = cleanText.replace(/  +/g, ' ');
  cleanText = cleanText.trim();

  return { cleanText, buttons };
};

// Load chat from localStorage
const loadChatFromStorage = (): ChatStorage | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return null;

    const data: ChatStorage = JSON.parse(stored);

    // Check if session has expired
    if (Date.now() - data.lastActivity > SESSION_EXPIRY_MS) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to load chat from storage:", error);
    return null;
  }
};

// Save chat to localStorage
const saveChatToStorage = (
  messages: Message[],
  conversationHistory: {role: string; content: string}[],
  sessionId: string
) => {
  if (typeof window === "undefined") return;

  try {
    const storedMessages: StoredMessage[] = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));

    const data: ChatStorage = {
      messages: storedMessages,
      conversationHistory,
      sessionId,
      lastActivity: Date.now()
    };

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save chat to storage:", error);
  }
};

// Clear chat from localStorage
const clearChatStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_STORAGE_KEY);
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{role: string; content: string}[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and load from storage
  useEffect(() => {
    const storedChat = loadChatFromStorage();

    if (storedChat && storedChat.messages.length > 0) {
      // Restore from storage
      const restoredMessages: Message[] = storedChat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(restoredMessages);
      setConversationHistory(storedChat.conversationHistory);
      setSessionId(storedChat.sessionId);
    } else {
      // New session
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
    }

    setIsInitialized(true);
  }, []);

  // Save to storage whenever messages change
  useEffect(() => {
    if (isInitialized && messages.length > 0 && sessionId) {
      saveChatToStorage(messages, conversationHistory, sessionId);
    }
  }, [messages, conversationHistory, sessionId, isInitialized]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Refocus input when typing stops (message sent)
  useEffect(() => {
    if (!isTyping && isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping, isOpen]);

  // Track session start and send welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId && isInitialized) {
      fetch("/api/chat/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_session",
          sessionId,
          data: {
            visitorId: localStorage.getItem("visitor_id") || "anonymous",
            userAgent: navigator.userAgent,
            pageUrl: window.location.href,
          }
        })
      }).catch(console.error);

      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        text: `Hi there! 👋 I'm the M Coding AI assistant.

I can help you find information about our BMW & MINI services, guide you to the right page, and answer your questions.

What can I help you with today?`,
        isBot: true,
        timestamp: new Date(),
        buttons: [
          { label: "View Services", action: "/services" },
          { label: "Browse Products", action: "/products" }
        ],
        source: "ai"
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, sessionId, isInitialized]);

  // Clear chat and start fresh
  const handleClearChat = useCallback(() => {
    clearChatStorage();
    setMessages([]);
    setConversationHistory([]);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

  const trackMessage = useCallback(async (message: Message) => {
    if (!sessionId) return;

    try {
      await fetch("/api/chat/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_message",
          sessionId,
          data: {
            id: message.id,
            text: message.text,
            isBot: message.isBot,
            source: message.source,
          }
        })
      });
    } catch (error) {
      console.error("Failed to track message:", error);
    }
  }, [sessionId]);

  const getAIResponse = async (userMessage: string): Promise<{
    text: string;
    source: "ai" | "fallback" | "error";
    inlineButtons: { label: string; action: string }[];
  }> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(-10),
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Parse for inline buttons
      const { cleanText, buttons: inlineButtons } = parseInlineButtons(data.response);

      return {
        text: cleanText,
        source: data.source || "ai",
        inlineButtons
      };
    } catch (error) {
      console.error("AI response error:", error);
      return {
        text: "I apologize, but I'm having trouble right now. Please try again or contact us via WhatsApp at 087 609 6830 for immediate assistance.",
        source: "error",
        inlineButtons: []
      };
    }
  };

  const getResponseButtons = (
    text: string,
    userMessage: string,
    inlineButtons: { label: string; action: string }[]
  ): { label: string; action: string; isPrimary?: boolean }[] | undefined => {
    // If we have inline buttons from AI, use those
    if (inlineButtons.length > 0) {
      return inlineButtons.map((btn, index) => ({
        ...btn,
        isPrimary: index === 0 // First button is primary
      }));
    }

    // No automatic buttons - let conversation flow naturally
    return undefined;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    trackMessage(userMessage);
    setConversationHistory(prev => [...prev, { role: "user", content: messageText }]);

    const { text: responseText, source, inlineButtons } = await getAIResponse(messageText);

    const botMessage: Message = {
      id: `msg_${Date.now()}_bot`,
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      buttons: getResponseButtons(responseText, messageText, inlineButtons),
      source,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    trackMessage(botMessage);
    setConversationHistory(prev => [...prev, { role: "assistant", content: responseText }]);

    // Refocus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleButtonClick = async (action: string) => {
    if (action === "whatsapp") {
      trackWhatsAppClick("ChatBot");

      if (sessionId) {
        fetch("/api/chat/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "whatsapp_conversion",
            sessionId,
            data: {}
          })
        }).catch(console.error);
      }

      const message = "Hi! I was chatting with your website assistant and would like to speak with your team.";
      const phoneNumber = "353876096830";
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (action.startsWith("http")) {
      window.open(action, '_blank');
    } else if (action.startsWith("/")) {
      window.location.href = action;
    } else {
      window.location.href = action;
    }

    // Refocus input after button click
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
      // Keep focus on input
      e.currentTarget.focus();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-48px)] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    M Coding AI
                    <Sparkles size={14} className="text-yellow-300" />
                  </h3>
                  <p className="text-xs text-white/80">Powered by AI - Usually replies instantly</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {messages.length > 1 && (
                  <button
                    onClick={handleClearChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Clear chat"
                    title="Start new conversation"
                  >
                    <RotateCcw size={18} className="text-white" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-zinc-950">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[85%] ${message.isBot ? "order-2" : "order-1"}`}>
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot size={14} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-500">M Coding AI</span>
                      {message.source === "ai" && (
                        <Sparkles size={10} className="text-yellow-500" />
                      )}
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isBot
                        ? "bg-zinc-800 text-gray-200 rounded-tl-sm"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.split('**').map((part, j) => (
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          ))}
                          {i < message.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  {message.buttons && message.isBot && (
                    <div className="flex flex-col gap-2 mt-3">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="animate-pulse">👆</span> Click below to continue:
                      </p>
                      {message.buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(button.action)}
                          className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden group ${
                            button.isPrimary
                              ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02]"
                              : button.action === "whatsapp"
                              ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02]"
                              : "bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 border border-white/10 text-white hover:scale-[1.02]"
                          }`}
                        >
                          {/* Shimmer effect */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          <span className="relative">{button.label}</span>
                          {(button.action.startsWith("http") || button.action === "whatsapp" || button.action.startsWith("/")) && (
                            <ExternalLink size={14} className="relative" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                </div>
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm ml-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 bg-zinc-900 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(action.query)}
                    disabled={isTyping}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs text-gray-300 transition-colors disabled:opacity-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-zinc-900 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 bg-zinc-800 border border-white/10 rounded-full text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              For urgent enquiries, <button onClick={() => handleButtonClick("whatsapp")} className="text-blue-400 hover:underline">chat on WhatsApp</button>
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-zinc-800 text-white"
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <ChevronDown size={28} />
        ) : (
          <>
            <MessageCircle size={28} />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 opacity-75 animate-slow-ping"></span>
          </>
        )}
      </button>
    </div>
  );
}

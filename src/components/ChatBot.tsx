"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import { trackWhatsAppClick } from "@/components/GoogleAnalytics";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  buttons?: { label: string; action: string }[];
  source?: "ai" | "fallback" | "error";
}

// Generate unique session ID
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Quick action buttons for the chat
const quickActions = [
  { label: "Services & Pricing", query: "What services do you offer and what are the prices?" },
  { label: "Book Appointment", query: "How do I book an appointment?" },
  { label: "Location & Hours", query: "Where are you located and what are your opening hours?" },
  { label: "Apple CarPlay", query: "Tell me about Apple CarPlay activation for BMW" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{role: string; content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

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

  // Track session start and send welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId) {
      // Start analytics session
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

      // Welcome message
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        text: `Hi there! 👋 I'm the M Coding AI assistant.

I can help you with information about our BMW & MINI services, pricing, booking, and more.

How can I help you today?`,
        isBot: true,
        timestamp: new Date(),
        buttons: [
          { label: "View Services", action: "/services" },
          { label: "Get a Quote", action: "whatsapp" }
        ],
        source: "ai"
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, sessionId]);

  // Track analytics for messages
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

  // Get AI response
  const getAIResponse = async (userMessage: string): Promise<{ text: string; source: "ai" | "fallback" | "error" }> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(-6), // Last 6 messages
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      return {
        text: data.response,
        source: data.source || "ai"
      };
    } catch (error) {
      console.error("AI response error:", error);
      return {
        text: "I apologize, but I'm having trouble right now. Please try again or contact us via WhatsApp at 087 609 6830 for immediate assistance.",
        source: "error"
      };
    }
  };

  // Detect if response should have action buttons
  const getResponseButtons = (text: string, userMessage: string): { label: string; action: string }[] | undefined => {
    const lowerText = text.toLowerCase();
    const lowerUserMsg = userMessage.toLowerCase();

    if (lowerUserMsg.includes("carplay") || lowerText.includes("carplay")) {
      return [
        { label: "View CarPlay Details", action: "/products/apple-carplay-activation" },
        { label: "Book Now", action: "whatsapp" }
      ];
    }

    if (lowerUserMsg.includes("region") || lowerText.includes("region change")) {
      return [
        { label: "View Region Change", action: "/products/region-change" },
        { label: "Get Quote", action: "whatsapp" }
      ];
    }

    if (lowerUserMsg.includes("xhp") || lowerText.includes("xhp")) {
      return [
        { label: "View XHP Details", action: "/products/bmw-xhp-transmission-remap" },
        { label: "Book Now", action: "whatsapp" }
      ];
    }

    if (lowerUserMsg.includes("book") || lowerUserMsg.includes("appointment")) {
      return [
        { label: "Book via WhatsApp", action: "whatsapp" },
        { label: "Contact Form", action: "/contact" }
      ];
    }

    if (lowerUserMsg.includes("service") || lowerUserMsg.includes("price")) {
      return [
        { label: "View All Products", action: "/products" },
        { label: "Get Custom Quote", action: "whatsapp" }
      ];
    }

    if (lowerUserMsg.includes("location") || lowerUserMsg.includes("where") || lowerUserMsg.includes("address")) {
      return [
        { label: "Get Directions", action: "https://maps.google.com/?q=Ardfinnan,Co.Tipperary,E91YX50" },
        { label: "Contact Us", action: "/contact" }
      ];
    }

    // Default buttons for most responses
    return [
      { label: "Chat with Team", action: "whatsapp" }
    ];
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Track user message
    trackMessage(userMessage);

    // Update conversation history for AI context
    setConversationHistory(prev => [...prev, { role: "user", content: messageText }]);

    // Get AI response
    const { text: responseText, source } = await getAIResponse(messageText);

    const botMessage: Message = {
      id: `msg_${Date.now()}_bot`,
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      buttons: getResponseButtons(responseText, messageText),
      source
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    // Track bot message
    trackMessage(botMessage);

    // Update conversation history
    setConversationHistory(prev => [...prev, { role: "assistant", content: responseText }]);
  };

  const handleButtonClick = async (action: string) => {
    if (action === "whatsapp") {
      // Track WhatsApp conversion
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
    } else {
      window.location.href = action;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="text-white" />
              </button>
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(button.action)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-medium text-white transition-colors flex items-center space-x-1"
                        >
                          <span>{button.label}</span>
                          {button.action.startsWith("http") || button.action === "whatsapp" ? (
                            <ExternalLink size={12} />
                          ) : null}
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
                onKeyPress={handleKeyPress}
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

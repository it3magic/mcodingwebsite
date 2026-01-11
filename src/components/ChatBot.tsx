"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, ChevronDown, Sparkles, Calendar } from "lucide-react";
import { trackWhatsAppClick } from "@/components/GoogleAnalytics";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  buttons?: { label: string; action: string; isPrimary?: boolean }[];
  source?: "ai" | "fallback" | "error";
  bookingData?: BookingData;
}

interface BookingData {
  service: string;
  vehicle: string;
  registration: string;
  contact: string;
  preferredDate: string;
  preferredTime: string;
}

// Generate unique session ID
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Quick action buttons for the chat
const quickActions = [
  { label: "Services & Pricing", query: "What services do you offer and what are the prices?" },
  { label: "Book Appointment", query: "I'd like to book an appointment" },
  { label: "Location & Hours", query: "Where are you located and what are your opening hours?" },
  { label: "Apple CarPlay", query: "I'm interested in Apple CarPlay activation" },
];

// Parse booking data from AI response
const parseBookingData = (text: string): { cleanText: string; bookingData: BookingData | null } => {
  const bookingMatch = text.match(/\{\{BOOKING_READY\}\}([\s\S]*?)\{\{\/BOOKING_READY\}\}/);

  if (!bookingMatch) {
    return { cleanText: text, bookingData: null };
  }

  const bookingContent = bookingMatch[1];
  const cleanText = text.replace(/\{\{BOOKING_READY\}\}[\s\S]*?\{\{\/BOOKING_READY\}\}/, '').trim();

  const getField = (field: string): string => {
    const match = bookingContent.match(new RegExp(`${field}:\\s*(.+)`, 'i'));
    return match ? match[1].trim() : '';
  };

  const bookingData: BookingData = {
    service: getField('Service'),
    vehicle: getField('Vehicle'),
    registration: getField('Registration'),
    contact: getField('Contact'),
    preferredDate: getField('Preferred Date'),
    preferredTime: getField('Preferred Time'),
  };

  const hasAllFields = Object.values(bookingData).every(val => val.length > 0);

  return {
    cleanText,
    bookingData: hasAllFields ? bookingData : null
  };
};

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
  // Clean up any double line breaks left behind
  cleanText = cleanText.replace(/\n{3,}/g, '\n\n');

  return { cleanText, buttons };
};

// Generate WhatsApp message from booking data
const generateWhatsAppBookingMessage = (booking: BookingData): string => {
  return `Hi! I'd like to book an appointment:

📋 *Service Required:* ${booking.service}
🚗 *Vehicle:* ${booking.vehicle}
🔢 *Registration:* ${booking.registration}
📞 *Contact Number:* ${booking.contact}
📅 *Preferred Date:* ${booking.preferredDate}
⏰ *Preferred Time:* ${booking.preferredTime}

Please let me know if this slot is available. Thank you!`;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{role: string; content: string}[]>([]);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
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

  // Refocus input when typing stops (message sent)
  useEffect(() => {
    if (!isTyping && isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping, isOpen]);

  // Track session start and send welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId) {
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

I can help you with information about our BMW & MINI services, pricing, booking appointments, and more.

How can I help you today?`,
        isBot: true,
        timestamp: new Date(),
        buttons: [
          { label: "View Services", action: "/services" },
          { label: "Book Appointment", action: "start_booking" }
        ],
        source: "ai"
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, sessionId]);

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
    bookingData: BookingData | null;
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

      // Parse for booking data
      const { cleanText: textAfterBooking, bookingData } = parseBookingData(data.response);

      // Parse for inline buttons
      const { cleanText, buttons: inlineButtons } = parseInlineButtons(textAfterBooking);

      return {
        text: cleanText,
        source: data.source || "ai",
        bookingData,
        inlineButtons
      };
    } catch (error) {
      console.error("AI response error:", error);
      return {
        text: "I apologize, but I'm having trouble right now. Please try again or contact us via WhatsApp at 087 609 6830 for immediate assistance.",
        source: "error",
        bookingData: null,
        inlineButtons: []
      };
    }
  };

  const getResponseButtons = (
    text: string,
    userMessage: string,
    bookingData: BookingData | null,
    inlineButtons: { label: string; action: string }[]
  ): { label: string; action: string; isPrimary?: boolean }[] | undefined => {
    // If we have booking data, show the booking button prominently
    if (bookingData) {
      return [
        { label: "📅 Send Booking Request via WhatsApp", action: "whatsapp_booking", isPrimary: true }
      ];
    }

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

    const { text: responseText, source, bookingData, inlineButtons } = await getAIResponse(messageText);

    if (bookingData) {
      setCurrentBooking(bookingData);
    }

    const botMessage: Message = {
      id: `msg_${Date.now()}_bot`,
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      buttons: getResponseButtons(responseText, messageText, bookingData, inlineButtons),
      source,
      bookingData: bookingData || undefined
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    trackMessage(botMessage);
    setConversationHistory(prev => [...prev, { role: "assistant", content: responseText }]);

    // Refocus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleButtonClick = async (action: string, messageBookingData?: BookingData) => {
    if (action === "whatsapp_booking") {
      const booking = messageBookingData || currentBooking;

      if (booking) {
        trackWhatsAppClick("ChatBot_Booking");

        if (sessionId) {
          fetch("/api/chat/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "whatsapp_conversion",
              sessionId,
              data: { type: "booking", ...booking }
            })
          }).catch(console.error);
        }

        const message = generateWhatsAppBookingMessage(booking);
        const phoneNumber = "353876096830";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    } else if (action === "whatsapp") {
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
    } else if (action === "start_booking") {
      handleSendMessage("I'd like to book an appointment");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
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
                          onClick={() => handleButtonClick(button.action, message.bookingData)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                            button.isPrimary
                              ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white"
                              : "bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white"
                          }`}
                        >
                          <span>{button.label}</span>
                          {(button.action.startsWith("http") || button.action === "whatsapp" || button.action === "whatsapp_booking") && (
                            <ExternalLink size={12} />
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

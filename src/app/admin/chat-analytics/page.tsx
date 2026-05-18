"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Users,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Bot,
  User,
  ExternalLink,
  Sparkles,
  Calendar,
  BarChart3
} from "lucide-react";

interface ChatSession {
  sessionId: string;
  visitorId: string;
  startedAt: string;
  endedAt?: string;
  messages: {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: string;
    source?: string;
  }[];
  convertedToWhatsApp: boolean;
  userAgent?: string;
  pageUrl?: string;
}

interface AnalyticsData {
  stats: {
    totalSessions: number;
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    whatsAppConversions: number;
    conversionRate: number | string;
    aiResponses: number;
    fallbackResponses: number;
    avgMessagesPerSession: number | string;
  };
  topQuestions: { keyword: string; count: number }[];
  sessionsByDay: Record<string, number>;
  recentSessions: ChatSession[];
}

export default function ChatAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [timeRange, setTimeRange] = useState(7);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/analytics?days=${timeRange}`);

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const clearAnalytics = async () => {
    if (!confirm("Are you sure you want to clear all chat analytics? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/chat/analytics", { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to clear analytics");
      }

      fetchAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="text-blue-400" />
                  Chat Analytics
                </h1>
                <p className="text-gray-400 text-sm">Monitor chatbot performance and conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm"
              >
                <option value={1}>Last 24 hours</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={clearAnalytics}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                title="Clear all analytics"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="text-blue-400" size={24} />
              <span className="text-gray-400 text-sm">Total Sessions</span>
            </div>
            <p className="text-3xl font-bold">{analytics?.stats.totalSessions || 0}</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <MessageSquare className="text-purple-400" size={24} />
              <span className="text-gray-400 text-sm">Total Messages</span>
            </div>
            <p className="text-3xl font-bold">{analytics?.stats.totalMessages || 0}</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <span className="text-gray-400 text-sm">WhatsApp Conversions</span>
            </div>
            <p className="text-3xl font-bold">{analytics?.stats.whatsAppConversions || 0}</p>
            <p className="text-sm text-gray-500">{analytics?.stats.conversionRate}% rate</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="text-yellow-400" size={24} />
              <span className="text-gray-400 text-sm">AI Responses</span>
            </div>
            <p className="text-3xl font-bold">{analytics?.stats.aiResponses || 0}</p>
            <p className="text-sm text-gray-500">{analytics?.stats.fallbackResponses || 0} fallback</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Top Questions & Chart */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Questions */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-400" />
                Top Question Topics
              </h2>
              {analytics?.topQuestions && analytics.topQuestions.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topQuestions.map((item, index) => (
                    <div key={item.keyword} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="capitalize">{item.keyword}</span>
                      </div>
                      <span className="text-gray-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data yet</p>
              )}
            </div>

            {/* Sessions by Day */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-purple-400" />
                Sessions by Day
              </h2>
              {analytics?.sessionsByDay && Object.keys(analytics.sessionsByDay).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(analytics.sessionsByDay)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 7)
                    .map(([day, count]) => (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(day).toLocaleDateString("en-IE", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            style={{ width: `${Math.min(count * 20, 100)}px` }}
                          />
                          <span>{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data yet</p>
              )}
            </div>

            {/* Performance Stats */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg. Messages/Session</span>
                  <span className="font-semibold">{analytics?.stats.avgMessagesPerSession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Messages</span>
                  <span className="font-semibold">{analytics?.stats.userMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bot Responses</span>
                  <span className="font-semibold">{analytics?.stats.botMessages}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-green-400" />
                Recent Conversations
              </h2>

              {analytics?.recentSessions && analytics.recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentSessions.map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => setSelectedSession(selectedSession?.sessionId === session.sessionId ? null : session)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSession?.sessionId === session.sessionId
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-400">
                            {formatDate(session.startedAt)}
                          </span>
                          {session.convertedToWhatsApp && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                              <ExternalLink size={10} />
                              WhatsApp
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {session.messages.length} messages
                        </span>
                      </div>

                      {/* Preview of first user message */}
                      {session.messages.find(m => !m.isBot) && (
                        <p className="text-sm text-gray-300 truncate">
                          "{session.messages.find(m => !m.isBot)?.text}"
                        </p>
                      )}

                      {/* Expanded view */}
                      {selectedSession?.sessionId === session.sessionId && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 max-h-[400px] overflow-y-auto">
                          {session.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                            >
                              <div className={`max-w-[80%] ${msg.isBot ? "" : ""}`}>
                                <div className="flex items-center space-x-2 mb-1">
                                  {msg.isBot ? (
                                    <Bot size={14} className="text-blue-400" />
                                  ) : (
                                    <User size={14} className="text-purple-400" />
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {msg.isBot ? "Bot" : "User"} • {formatTime(msg.timestamp)}
                                  </span>
                                  {msg.source === "ai" && (
                                    <Sparkles size={10} className="text-yellow-500" />
                                  )}
                                </div>
                                <div
                                  className={`px-3 py-2 rounded-lg text-sm ${
                                    msg.isBot
                                      ? "bg-zinc-800 text-gray-300"
                                      : "bg-blue-600/30 text-gray-200"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-500">No chat sessions yet</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Conversations will appear here when visitors use the chatbot
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Status Notice */}
        <div className="mt-8 p-4 bg-zinc-900 border border-white/10 rounded-xl">
          <div className="flex items-start space-x-3">
            <Sparkles className="text-yellow-400 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold mb-1">AI Backend Status</h3>
              <p className="text-sm text-gray-400">
                The chatbot will use OpenAI for responses when an API key is configured.
                Without an API key, it falls back to rule-based responses.
                To enable AI, add <code className="bg-zinc-800 px-1.5 py-0.5 rounded">OPENAI_API_KEY</code> to your environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

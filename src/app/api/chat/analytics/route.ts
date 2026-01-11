import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// In-memory storage for analytics (in production, use a database)
// This persists during server runtime but resets on restart
let chatAnalytics: ChatSession[] = [];

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  source?: "ai" | "fallback" | "error";
}

interface ChatSession {
  sessionId: string;
  visitorId: string;
  startedAt: string;
  endedAt?: string;
  messages: ChatMessage[];
  convertedToWhatsApp: boolean;
  userAgent?: string;
  pageUrl?: string;
}

// GET - Retrieve analytics (admin only)
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin-auth");

  // Check for admin authentication cookie
  if (!adminAuth?.value || adminAuth.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7");

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Filter sessions by date
  const filteredSessions = chatAnalytics.filter(
    session => new Date(session.startedAt) >= cutoffDate
  );

  // Calculate statistics
  const stats = {
    totalSessions: filteredSessions.length,
    totalMessages: filteredSessions.reduce((acc, s) => acc + s.messages.length, 0),
    userMessages: filteredSessions.reduce(
      (acc, s) => acc + s.messages.filter(m => !m.isBot).length, 0
    ),
    botMessages: filteredSessions.reduce(
      (acc, s) => acc + s.messages.filter(m => m.isBot).length, 0
    ),
    whatsAppConversions: filteredSessions.filter(s => s.convertedToWhatsApp).length,
    conversionRate: filteredSessions.length > 0
      ? ((filteredSessions.filter(s => s.convertedToWhatsApp).length / filteredSessions.length) * 100).toFixed(1)
      : 0,
    aiResponses: filteredSessions.reduce(
      (acc, s) => acc + s.messages.filter(m => m.source === "ai").length, 0
    ),
    fallbackResponses: filteredSessions.reduce(
      (acc, s) => acc + s.messages.filter(m => m.source === "fallback").length, 0
    ),
    avgMessagesPerSession: filteredSessions.length > 0
      ? (filteredSessions.reduce((acc, s) => acc + s.messages.length, 0) / filteredSessions.length).toFixed(1)
      : 0,
  };

  // Get common questions (user messages)
  const allUserMessages = filteredSessions.flatMap(
    s => s.messages.filter(m => !m.isBot).map(m => m.text.toLowerCase())
  );

  const questionFrequency: Record<string, number> = {};
  const keywords = ["price", "cost", "carplay", "region", "xhp", "remap", "service", "book", "location", "hours", "injector", "headlight"];

  for (const msg of allUserMessages) {
    for (const keyword of keywords) {
      if (msg.includes(keyword)) {
        questionFrequency[keyword] = (questionFrequency[keyword] || 0) + 1;
      }
    }
  }

  const topQuestions = Object.entries(questionFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  // Sessions by day
  const sessionsByDay: Record<string, number> = {};
  for (const session of filteredSessions) {
    const day = new Date(session.startedAt).toISOString().split('T')[0];
    sessionsByDay[day] = (sessionsByDay[day] || 0) + 1;
  }

  return NextResponse.json({
    stats,
    topQuestions,
    sessionsByDay,
    recentSessions: filteredSessions.slice(-20).reverse(), // Last 20 sessions
  });
}

// POST - Record a new chat event
export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, data } = await request.json();

    switch (action) {
      case "start_session":
        const newSession: ChatSession = {
          sessionId,
          visitorId: data.visitorId || "anonymous",
          startedAt: new Date().toISOString(),
          messages: [],
          convertedToWhatsApp: false,
          userAgent: data.userAgent,
          pageUrl: data.pageUrl,
        };
        chatAnalytics.push(newSession);

        // Keep only last 1000 sessions to prevent memory issues
        if (chatAnalytics.length > 1000) {
          chatAnalytics = chatAnalytics.slice(-1000);
        }

        return NextResponse.json({ success: true, sessionId });

      case "add_message":
        const session = chatAnalytics.find(s => s.sessionId === sessionId);
        if (session) {
          session.messages.push({
            id: data.id,
            text: data.text,
            isBot: data.isBot,
            timestamp: new Date().toISOString(),
            source: data.source,
          });
          session.endedAt = new Date().toISOString();
        }
        return NextResponse.json({ success: true });

      case "whatsapp_conversion":
        const convSession = chatAnalytics.find(s => s.sessionId === sessionId);
        if (convSession) {
          convSession.convertedToWhatsApp = true;
          convSession.endedAt = new Date().toISOString();
        }
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 });
  }
}

// DELETE - Clear all analytics (admin only)
export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin-auth");

  // Check for admin authentication cookie
  if (!adminAuth?.value || adminAuth.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  chatAnalytics = [];
  return NextResponse.json({ success: true, message: "Analytics cleared" });
}

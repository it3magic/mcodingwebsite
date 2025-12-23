import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const notificationCookie = cookieStore.get("site-notification");

  if (notificationCookie?.value) {
    try {
      return NextResponse.json(JSON.parse(notificationCookie.value));
    } catch (error) {
      // If parsing fails, return default
    }
  }

  // Return default if no cookie exists
  return NextResponse.json({
    enabled: false,
    message: "",
    type: "info",
    lastUpdated: "",
  });
}

export async function POST(request: Request) {
  // Check authentication
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { enabled, message, type } = body;

    const notificationData = {
      enabled: Boolean(enabled),
      message: String(message || ""),
      type: type || "info",
      lastUpdated: new Date().toISOString(),
    };

    const response = NextResponse.json({ success: true, data: notificationData });

    // Store notification data in a cookie (max age: 1 year)
    response.cookies.set("site-notification", JSON.stringify(notificationData), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

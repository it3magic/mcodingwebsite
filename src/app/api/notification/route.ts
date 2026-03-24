import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const store = getStore("site-data");
    const notificationData = await store.get("notification", { type: "text" });

    if (notificationData) {
      return NextResponse.json(JSON.parse(notificationData));
    }

    // Return default if no data exists
    return NextResponse.json({
      enabled: false,
      message: "",
      type: "info",
      lastUpdated: "",
    });
  } catch (error) {
    console.error("Failed to fetch notification:", error);
    return NextResponse.json({
      enabled: false,
      message: "",
      type: "info",
      lastUpdated: "",
    });
  }
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

    // Store in Netlify Blobs
    const store = getStore("site-data");
    await store.set("notification", JSON.stringify(notificationData));

    return NextResponse.json({
      success: true,
      data: notificationData
    });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

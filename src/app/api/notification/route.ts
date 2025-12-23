import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { isAuthenticated } from "@/lib/auth";

const NOTIFICATION_FILE = join(process.cwd(), "public", "notification.json");

export async function GET() {
  try {
    const data = await readFile(NOTIFICATION_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return default if file doesn't exist or can't be read
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

    // Return the notification data with instructions for manual update
    // Netlify's file system is read-only, so changes must be committed to GitHub
    return NextResponse.json({
      success: true,
      data: notificationData,
      instructions: "Update public/notification.json in your GitHub repository with this data, then redeploy on Netlify."
    });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

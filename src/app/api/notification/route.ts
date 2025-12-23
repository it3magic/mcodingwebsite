import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { isAuthenticated } from "@/lib/auth";

const NOTIFICATION_FILE = join(process.cwd(), "notification.json");

export async function GET() {
  try {
    const data = await readFile(NOTIFICATION_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return default if file doesn't exist
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

    await writeFile(NOTIFICATION_FILE, JSON.stringify(notificationData, null, 2));

    return NextResponse.json({ success: true, data: notificationData });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

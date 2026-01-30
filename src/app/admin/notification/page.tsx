"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Save, Eye, EyeOff, ArrowLeft, Info } from "lucide-react";

interface NotificationData {
  enabled: boolean;
  message: string;
  type: "info" | "warning" | "alert";
  lastUpdated: string;
}

export default function NotificationAdminPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationData>({
    enabled: false,
    message: "",
    type: "info",
    lastUpdated: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Fetch current notification
    fetch("/api/notification")
      .then((res) => res.json())
      .then((data: NotificationData) => {
        setNotification(data);
      })
      .catch((error) => {
        console.error("Failed to load notification:", error);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveMessage("✓ Notification updated successfully! Live on all devices now.");
        setTimeout(() => setSaveMessage(""), 5000);
      } else {
        setSaveMessage("✗ Failed to update notification");
      }
    } catch (error) {
      setSaveMessage("✗ Error saving notification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Homepage <span className="text-gradient">Notification</span>
              </h1>
              <p className="text-gray-400">
                Manage urgent messages, closures, and announcements
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Enable/Disable Toggle */}
          <div className="bg-zinc-950 border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <Bell size={20} />
                  Banner Status
                </h3>
                <p className="text-gray-400 text-sm">
                  {notification.enabled ? "Banner is visible on homepage" : "Banner is hidden"}
                </p>
              </div>
              <button
                onClick={() => setNotification({ ...notification, enabled: !notification.enabled })}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                  notification.enabled ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    notification.enabled ? "translate-x-11" : "translate-x-1"
                  }`}
                >
                  {notification.enabled ? (
                    <Eye className="w-5 h-5 mx-auto mt-1.5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 mx-auto mt-1.5 text-gray-600" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-zinc-950 border border-white/10 rounded-lg p-6 mb-6">
            <label className="block text-white font-semibold mb-3">
              Notification Message
            </label>
            <textarea
              value={notification.message}
              onChange={(e) => setNotification({ ...notification, message: e.target.value })}
              placeholder="e.g., 🔧 Garage closed for Christmas holidays from Dec 24-26. Reopening Dec 27th."
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
            />
            <p className="text-gray-400 text-sm mt-2">
              {notification.message.length} characters
            </p>
          </div>

          {/* Type Selection */}
          <div className="bg-zinc-950 border border-white/10 rounded-lg p-6 mb-6">
            <label className="block text-white font-semibold mb-3">
              Banner Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setNotification({ ...notification, type: "info" })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  notification.type === "info"
                    ? "border-blue-500 bg-blue-600/20"
                    : "border-white/20 bg-black hover:bg-white/5"
                }`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Info</span>
                </div>
              </button>

              <button
                onClick={() => setNotification({ ...notification, type: "warning" })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  notification.type === "warning"
                    ? "border-orange-500 bg-orange-600/20"
                    : "border-white/20 bg-black hover:bg-white/5"
                }`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-orange-600 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Warning</span>
                </div>
              </button>

              <button
                onClick={() => setNotification({ ...notification, type: "alert" })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  notification.type === "alert"
                    ? "border-red-500 bg-red-600/20"
                    : "border-white/20 bg-black hover:bg-white/5"
                }`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-red-600 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Alert</span>
                </div>
              </button>
            </div>
          </div>

          {/* Preview */}
          {notification.enabled && notification.message && (
            <div className="bg-zinc-950 border border-white/10 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Preview</h3>
              <div
                className={`${
                  notification.type === "info"
                    ? "bg-blue-600/95 border-blue-500"
                    : notification.type === "warning"
                    ? "bg-orange-600/95 border-orange-500"
                    : "bg-red-600/95 border-red-500"
                } border-2 rounded-lg px-6 py-4`}
              >
                <p className="text-white font-semibold text-lg">{notification.message}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveMessage && (
                <span
                  className={`text-sm font-medium ${
                    saveMessage.includes("✓") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {saveMessage}
                </span>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-200 flex items-start gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Changes are instant! Click "Save Changes" and the banner will appear on all devices immediately. No need to redeploy or refresh.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

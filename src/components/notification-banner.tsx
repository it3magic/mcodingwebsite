"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface NotificationData {
  enabled: boolean;
  message: string;
  type: "info" | "warning" | "alert";
  lastUpdated: string;
}

export default function NotificationBanner() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch notification data
    fetch("/api/notification")
      .then((res) => res.json())
      .then((data: NotificationData) => {
        setNotification(data);
        setIsLoading(false);

        // Check if user has dismissed this specific notification
        const dismissedTimestamp = sessionStorage.getItem("notification-dismissed");
        if (dismissedTimestamp === data.lastUpdated) {
          setIsDismissed(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (notification?.lastUpdated) {
      sessionStorage.setItem("notification-dismissed", notification.lastUpdated);
    }
  };

  if (isLoading || !notification || !notification.enabled || !notification.message || isDismissed) {
    return null;
  }

  const bgColors = {
    info: "bg-blue-600/95 border-blue-500",
    warning: "bg-orange-600/95 border-orange-500",
    alert: "bg-red-600/95 border-red-500",
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    alert: AlertCircle,
  };

  const Icon = icons[notification.type];

  return (
    <div className="fixed top-16 sm:top-20 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-3 animate-slideDown">
      <div className={`${bgColors[notification.type]} border-2 rounded-lg shadow-2xl max-w-4xl mx-auto backdrop-blur-sm animate-pulse-slow`}>
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 mt-0.5 sm:mt-0 animate-bounce-gentle" />
            <p className="text-white font-semibold text-sm sm:text-base md:text-lg leading-snug sm:leading-relaxed break-words">
              {notification.message}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10 rounded -mt-1 sm:mt-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

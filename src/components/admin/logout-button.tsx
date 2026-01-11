"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/30 hover:border-red-500/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut size={18} />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}

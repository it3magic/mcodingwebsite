"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-red-900/10" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4">
              <Lock className="text-blue-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin <span className="text-gradient">Access</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your password to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-600 text-white pr-12"
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-blue-200 text-center">
            <strong>💡 Note:</strong> Set your admin password in the <code className="bg-black/30 px-2 py-1 rounded">ADMIN_PASSWORD</code> environment variable
          </p>
        </div>
      </div>
    </div>
  );
}

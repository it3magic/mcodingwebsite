import Link from "next/link";
import { redirect } from "next/navigation";
import { FileSpreadsheet, Mail, Zap, Download, ExternalLink, Bell, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import LogoutButton from "@/components/admin/logout-button";

export const metadata = {
  title: "Admin Dashboard | M Coding Ireland",
  description: "Manage your website and subscribers",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  // Check if user is authenticated
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-gray-400">
                Manage notifications, subscribers, and site content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LogoutButton />
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Netlify Dashboard */}
            <a
              href="https://app.netlify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <ExternalLink className="text-blue-400" size={24} />
                </div>
                <ExternalLink className="text-gray-600 group-hover:text-gray-400" size={16} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Netlify Dashboard
              </h3>
              <p className="text-sm text-gray-400">
                View all form submissions and export data
              </p>
            </a>

            {/* Export Subscribers */}
            <div className="bg-gradient-to-br from-purple-900/20 to-red-900/20 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Download className="text-purple-400" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Export as CSV
              </h3>
              <p className="text-sm text-gray-400">
                Download subscriber list from Netlify Forms
              </p>
            </div>

            {/* Homepage Notification */}
            <Link
              href="/admin/notification"
              className="group bg-gradient-to-br from-red-900/20 to-blue-900/20 border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Bell className="text-red-400" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Homepage Banner
              </h3>
              <p className="text-sm text-gray-400">
                Manage urgent announcements and closures
              </p>
            </Link>
          </div>

          {/* How to Access Subscribers */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Download className="text-blue-400" />
              How to Access Your Subscribers
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Open Netlify Dashboard
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Visit{" "}
                    <a
                      href="https://app.netlify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      app.netlify.com
                    </a>{" "}
                    and log in to your account
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Navigate to Forms
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Select your site <strong className="text-white">(m-coding.ie)</strong> → Click{" "}
                    <strong className="text-white">"Forms"</strong> in the left sidebar
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    View Subscribers
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Click on <strong className="text-white">"blog-newsletter"</strong> form to see all submissions
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Export Data
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Click <strong className="text-white">"Export as CSV"</strong> button to download all subscriber emails
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Options */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="text-yellow-400" />
              Automation Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Sheets */}
              <div className="bg-gradient-to-br from-green-900/10 to-blue-900/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileSpreadsheet className="text-green-400" size={24} />
                  <h3 className="text-lg font-bold text-white">Google Sheets</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Automatically add new subscribers to a Google Sheet using Zapier or Make
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">✓</span> Real-time updates
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">✓</span> Free (up to 100/month)
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">✓</span> Easy to manage
                  </div>
                </div>
              </div>

              {/* Email Service */}
              <div className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="text-blue-400" size={24} />
                  <h3 className="text-lg font-bold text-white">Email Service</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Connect to Mailchimp, ConvertKit, or SendGrid for professional email marketing
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-blue-400">✓</span> Send newsletters
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-blue-400">✓</span> Professional tools
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-blue-400">✓</span> Analytics & tracking
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>💡 Tip:</strong> For detailed setup instructions, check the{" "}
                <code className="bg-black/30 px-2 py-1 rounded text-blue-300">
                  .same/subscriber-management-guide.md
                </code>{" "}
                file in your project
              </p>
            </div>
          </div>

          {/* Setup Email Notifications */}
          <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-red-900/20 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Bell className="text-purple-400" />
              Set Up Email Notifications (Recommended)
            </h2>

            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                Get an email alert every time someone subscribes to your newsletter:
              </p>

              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">1.</span>
                  <span>Go to Netlify Dashboard → Forms</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">2.</span>
                  <span>Click "Form notifications"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">3.</span>
                  <span>Add "Email notification"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">4.</span>
                  <span>
                    Enter your email: <code className="bg-black/30 px-2 py-1 rounded text-blue-300">mcodingireland@gmail.com</code>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">5.</span>
                  <span>Save and you're done!</span>
                </li>
              </ol>
            </div>

            <a
              href="https://app.netlify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              <span>Go to Netlify Dashboard</span>
              <ExternalLink size={18} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

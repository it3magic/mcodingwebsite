"use client";

import { useState } from "react";
import { X, Car, UserPlus, ArrowRight, ChevronLeft, FileText, Wrench } from "lucide-react";
import Link from "next/link";

interface ServicePackagePopupProps {
  show: boolean;
  onClose: () => void;
}

type PopupView = "initial" | "new-customer" | "returning-customer";

export default function ServicePackagePopup({ show, onClose }: ServicePackagePopupProps) {
  const [currentView, setCurrentView] = useState<PopupView>("initial");

  if (!show) return null;

  const handleViewChange = (view: PopupView) => {
    setCurrentView(view);
  };

  const handleClose = () => {
    setCurrentView("initial");
    onClose();
  };

  const handleBack = () => {
    setCurrentView("initial");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-zinc-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-blue-500/20 animate-in zoom-in duration-300 pointer-events-auto relative max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Back Button (shown on detail views) */}
          {currentView !== "initial" && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-1 text-sm"
              aria-label="Go back"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {/* Initial View */}
          {currentView === "initial" && (
            <div className="animate-in fade-in duration-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Not Sure Which Service You Need?
                </h3>
                <p className="text-gray-400 text-sm">
                  Let us help you determine the right service package
                </p>
              </div>

              <div className="space-y-4">
                {/* New to Us Option */}
                <button
                  onClick={() => handleViewChange("new-customer")}
                  className="group w-full p-6 bg-zinc-800/50 border border-white/10 rounded-xl hover:bg-zinc-800 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">
                        <UserPlus className="text-gray-400 group-hover:text-white transition-colors" size={24} />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-1">New to M Coding</div>
                        <div className="text-gray-400 text-sm">First time booking with us</div>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                  </div>
                </button>

                {/* Returning Customer Option */}
                <button
                  onClick={() => handleViewChange("returning-customer")}
                  className="group w-full p-6 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-red-600/20 border border-blue-500/40 rounded-xl hover:from-blue-600/30 hover:via-purple-600/30 hover:to-red-600/30 hover:border-blue-500/60 transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all">
                        <Car className="text-blue-400 group-hover:text-blue-300 transition-colors" size={24} />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-1">Returning Customer</div>
                        <div className="text-gray-300 text-sm">Previously serviced with us</div>
                      </div>
                    </div>
                    <ArrowRight className="text-blue-400 group-hover:text-blue-300 transition-colors" size={20} />
                  </div>
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-6">
                Click anywhere outside to dismiss
              </p>
            </div>
          )}

          {/* New Customer View */}
          {currentView === "new-customer" && (
            <div className="animate-in fade-in duration-200">
              <div className="text-center mb-6 mt-8">
                <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-4">
                  <UserPlus className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to M Coding
                </h3>
                <p className="text-gray-400 text-sm">
                  Let's determine the best service for your vehicle
                </p>
              </div>

              <div className="bg-zinc-800/50 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Service History Check</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Please provide your vehicle's <strong className="text-white">VIN number</strong> so we can check
                      the official BMW service history (AOS) and recommend the appropriate service package.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-white/10">
                  <Wrench className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Service Recommendation</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      If your vehicle has no service history or hasn't been serviced recently,
                      we highly recommend starting with at least a <strong className="text-white">Major Service</strong> to
                      ensure optimal performance and reliability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300 text-center">
                  <strong className="text-white">Pro Tip:</strong> Your VIN is located on your vehicle's Log Book
                  or on the driver's door jamb
                </p>
              </div>

              <Link
                href="/contact?inquiry=new-vehicle"
                onClick={handleClose}
                className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/30"
              >
                <span>Proceed to Booking</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          )}

          {/* Returning Customer View */}
          {currentView === "returning-customer" && (
            <div className="animate-in fade-in duration-200">
              <div className="text-center mb-6 mt-8">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-2xl mb-4">
                  <Car className="text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome Back!
                </h3>
                <p className="text-gray-400 text-sm">
                  Let's locate your service information
                </p>
              </div>

              <div className="bg-zinc-800/50 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Check Your Service Sticker</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Look for the <strong className="text-white">M Coding service sticker</strong> typically located:
                    </p>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>Under the bonnet (hood)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>On the driver's door jamb</span>
                      </li>
                    </ul>
                    <p className="text-gray-400 text-xs mt-3 italic">
                      The sticker contains your next recommended service information
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-white/10">
                  <Wrench className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Can't Find Your Sticker?</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      No problem! Simply provide us with your <strong className="text-white">last invoice number</strong> or
                      <strong className="text-white"> vehicle VIN</strong>, and we'll check our records to determine
                      which service package your vehicle requires.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300 text-center">
                  <strong className="text-white">Note:</strong> We maintain detailed digital service records
                  for all our customers in the BMW system
                </p>
              </div>

              <Link
                href="/contact?inquiry=returning-vehicle"
                onClick={handleClose}
                className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/30"
              >
                <span>Proceed to Booking</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

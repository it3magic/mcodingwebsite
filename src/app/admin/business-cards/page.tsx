"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

export default function BusinessCardsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [eircodeQrDataUrl, setEircodeQrDataUrl] = useState<string>("");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const router = useRouter();

  // Refs for card elements
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // Google Reviews URL - Direct link to leave a review
  const googleReviewsUrl = "https://g.page/r/CZE7bP25Qs3hEBM/review";
  // Eircode QR (links to Google Maps)
  const eircodeMapUrl = "https://www.google.com/maps/search/?api=1&query=E91YX50";

  // Convert image to base64 data URL
  const imageToDataUrl = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // Generate QR codes and preload logo as data URLs on mount
  useEffect(() => {
    const generateAssets = async () => {
      try {
        // Generate Google Reviews QR code
        const reviewsQR = await QRCode.toDataURL(googleReviewsUrl, {
          width: 150,
          margin: 0,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrCodeDataUrl(reviewsQR);

        // Generate Eircode/Location QR code
        const locationQR = await QRCode.toDataURL(eircodeMapUrl, {
          width: 100,
          margin: 0,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setEircodeQrDataUrl(locationQR);

        // Preload logo as base64 data URL for html2canvas
        try {
          const logoBase64 = await imageToDataUrl("/m-logo.png");
          setLogoDataUrl(logoBase64);
        } catch (logoError) {
          console.warn("Could not preload logo, will use direct path:", logoError);
          // Fallback to direct path
          setLogoDataUrl("/m-logo.png");
        }
      } catch (error) {
        console.error("Error generating assets:", error);
      }
    };
    generateAssets();
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Download PNG images of the front and back cards
  const handleDownloadImages = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;
    if (!qrCodeDataUrl || !eircodeQrDataUrl) {
      alert("QR codes are still loading. Please wait a moment and try again.");
      return;
    }

    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // Helper to download a canvas as PNG
      const downloadCanvasAsPNG = (canvas: HTMLCanvasElement, filename: string) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1.0);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      // Wait a bit for all images to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture front card at high resolution for print (scale 4 = ~300 DPI)
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 4,
        backgroundColor: '#0a0a0a',
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure images in cloned document have correct data URLs
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach((img) => {
            if (img.src.includes('/m-logo.png') && logoDataUrl) {
              img.src = logoDataUrl;
            }
          });
        }
      });
      downloadCanvasAsPNG(frontCanvas, 'M-Coding-Business-Card-Front.png');

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture back card at high resolution for print
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 4,
        backgroundColor: '#0a0a0a',
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      });
      downloadCanvasAsPNG(backCanvas, 'M-Coding-Business-Card-Back.png');

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Error generating PNG images. Please try again or contact support.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      {/* Header */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Admin Dashboard</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Business <span className="text-gradient">Cards</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Download high-resolution images to send to your printing company
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleDownloadImages}
            disabled={isGenerating || !qrCodeDataUrl || !logoDataUrl}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Generating Images...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                <span>Download PNG Images for Print</span>
              </>
            )}
          </button>
        </div>

        {downloadSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8">
            <p className="text-green-400 text-sm">
              <strong>Images downloaded!</strong> You can now send these high-resolution PNG files to your printing company. The images are at 300 DPI quality, suitable for professional printing.
            </p>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <p className="text-blue-400 text-sm">
            <strong>Print Specifications:</strong> Standard business card size 89mm × 51mm (3.5" × 2"). Images are exported at 300 DPI for professional print quality. Send the downloaded PNGs directly to your printer.
          </p>
        </div>
      </div>

      {/* Business Card Designs */}
      <div className="container mx-auto px-4 lg:px-8">

        {/* Card Design 1 - Front */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Front of Card</h2>
          <div className="flex justify-center">
            <div
              ref={frontCardRef}
              data-card="front"
              className="relative w-[89mm] h-[51mm] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-lg overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10"
              style={{
                aspectRatio: '89/51',
                minWidth: '356px',
                minHeight: '204px'
              }}
            >
              {/* Background gradient accent */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 via-purple-600/5 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-600/10 to-transparent" />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600" />

              {/* Content */}
              <div className="relative h-full p-5 flex flex-col justify-between">
                {/* Logo and Name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logoDataUrl || "/m-logo.png"}
                      alt="M Coding"
                      className="h-10 w-auto"
                      crossOrigin="anonymous"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg tracking-wide">M CODING</h3>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest">Ireland</p>
                    </div>
                  </div>

                  {/* BMW Registered Badge */}
                  <div className="text-right">
                    <div className="inline-block px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-[8px] text-blue-400 font-semibold uppercase">
                      BMW Registered
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div className="text-center">
                  <p className="text-white text-sm font-medium">BMW & MINI Specialist</p>
                  <p className="text-gray-500 text-[10px] mt-1">Servicing • Coding • Remapping • Retrofitting</p>
                </div>

                {/* Contact Info */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-gray-300 text-xs">087 609 6830</p>
                    <p className="text-gray-400 text-[10px]">mcodingireland@gmail.com</p>
                    <p className="text-gray-400 text-[10px]">m-coding.ie</p>
                  </div>

                  {/* Eircode */}
                  <div className="text-right">
                    <p className="text-gray-500 text-[8px] uppercase tracking-wider mb-1">Find Us</p>
                    <p className="text-white font-mono font-bold text-sm tracking-wider">E91 YX50</p>
                    <p className="text-gray-500 text-[8px]">Ardfinnan, Tipperary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Design 1 - Back */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Back of Card (QR Code for Reviews)</h2>
          <div className="flex justify-center">
            <div
              ref={backCardRef}
              className="relative w-[89mm] h-[51mm] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/10"
              style={{
                aspectRatio: '89/51',
                minWidth: '356px',
                minHeight: '204px'
              }}
            >
              {/* Background gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-red-600/5" />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600" />

              {/* Content */}
              <div className="relative h-full p-5 flex items-center justify-center">
                <div className="flex items-center space-x-8">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-2 rounded-lg shadow-lg">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="Scan for Google Reviews"
                          className="w-24 h-24"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                          <Loader2 className="animate-spin text-gray-500" size={24} />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-wider">Scan for Reviews</p>
                  </div>

                  {/* Divider */}
                  <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                  {/* Message */}
                  <div className="text-center max-w-[140px]">
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white text-sm font-semibold mb-1">Love our service?</p>
                    <p className="text-gray-400 text-[10px] leading-relaxed">
                      Leave us a review on Google - your feedback helps us grow!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Printing Instructions */}
        <div className="mt-12 bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">How to Order Your Cards</h3>
          <ol className="space-y-3 text-gray-300 list-decimal list-inside">
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-white">1.</span>
              <span>Click "Download PNG Images for Print" above to get your high-resolution card images</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-white">2.</span>
              <span>Visit a printing service like <strong className="text-blue-400">Vistaprint</strong>, <strong className="text-blue-400">Moo</strong>, or your local print shop</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-white">3.</span>
              <span>Upload the front and back images when creating your order</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-white">4.</span>
              <span>Select size: <strong>89mm × 51mm</strong> (or 3.5" × 2" standard business card)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-white">5.</span>
              <span>Recommended paper: <strong>350-400gsm matte or silk finish</strong></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

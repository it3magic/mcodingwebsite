import Image from "next/image";

export default function HeadlightComparisonPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 md:p-8 pt-24 md:pt-28">
      <div className="w-full max-w-[1400px]">
        {/* Main Title */}
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12">
          <span className="bg-gradient-to-r from-[#0066FF] via-[#8855CC] to-[#FF0000] bg-clip-text text-transparent">
            BMW F10 Pre-LCI Xenon: How to Identify Your Headlights
          </span>
        </h1>

        {/* Comparison Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative">
          {/* Non-Adaptive Side */}
          <div className="flex flex-col items-center">
            {/* Label Badge */}
            <div className="mb-4 px-6 py-2 bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-full border border-[#333]">
              <span className="text-gray-300 text-sm font-semibold tracking-wide uppercase">Non-Adaptive</span>
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-[#2a2a2a] shadow-2xl">
              <Image
                src="/headlights/non-adaptive.png"
                alt="BMW F10 Pre-LCI Non-Adaptive Xenon Headlight with smooth projector lens"
                fill
                className="object-cover"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Feature callout */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full" />
                    Smooth projector lens surface
                  </p>
                </div>
              </div>
            </div>

            {/* Info below image */}
            <div className="mt-5 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Standard Xenon
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-3">
                (Bi-Xenon)
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <span className="text-gray-300 text-sm font-mono">S522A</span>
                </div>
                <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <span className="text-gray-400 text-xs">No swivel function</span>
                </div>
              </div>
            </div>
          </div>

          {/* VS Badge - Center */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0066FF] via-[#8855CC] to-[#FF0000] flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
          </div>

          {/* Mobile VS Badge */}
          <div className="flex md:hidden items-center justify-center py-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF] via-[#8855CC] to-[#FF0000] flex items-center justify-center">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
          </div>

          {/* Adaptive Side */}
          <div className="flex flex-col items-center">
            {/* Label Badge */}
            <div className="mb-4 px-6 py-2 bg-gradient-to-r from-[#0066FF] via-[#8855CC] to-[#FF0000] rounded-full">
              <span className="text-white text-sm font-semibold tracking-wide uppercase">Adaptive</span>
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-[#2a2a2a] shadow-2xl">
              <Image
                src="/headlights/adaptive.png"
                alt="BMW F10 Pre-LCI Adaptive Xenon Headlight with hatched projector lens pattern"
                fill
                className="object-cover"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Feature callout */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-[#0066FF] to-[#FF0000] rounded-full" />
                    Hatched/lined projector lens
                  </p>
                </div>
              </div>
            </div>

            {/* Info below image */}
            <div className="mt-5 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Adaptive Xenon
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-3">
                (AHL - Adaptive Headlights)
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-[#0066FF]/20 to-[#FF0000]/20 rounded-lg border border-[#333]">
                  <span className="text-white text-sm font-mono">S524A</span>
                </div>
                <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <span className="text-green-400 text-xs">Swivel function</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Difference Callout */}
        <div className="mt-10 md:mt-14 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] rounded-xl p-5 md:p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0066FF]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How to Tell the Difference
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Look closely at the <strong className="text-white">projector lens surface</strong>. The non-adaptive xenon has a
              <strong className="text-gray-300"> smooth, clear surface</strong>, while the adaptive xenon has a distinctive
              <strong className="text-white"> hatched or lined pattern</strong> visible on the inner lens. The adaptive headlights
              swivel when you turn the steering wheel to illuminate corners.
            </p>
          </div>
        </div>

        {/* M Coding Branding */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs tracking-wide">
            M CODING IRELAND
          </p>
        </div>
      </div>
    </div>
  );
}

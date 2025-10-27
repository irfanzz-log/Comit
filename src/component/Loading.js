import Image from "next/image";

/**
 * Loading component displays a fullscreen loading animation with logo
 * Uses CSS animations for fade-out and spinning effects
 */
export default function Loading() {
  return (
    <div className="loading-screen fixed inset-0 flex justify-center items-center z-50 bg-white">
      {/* Logo */}
      <Image 
        className="loading-screen__logo max-w-24 z-50" 
        src="/logo/commitLogo.png" 
        alt="COMIT Loading Logo" 
        width={400}
        height={400}
      />
      
      {/* Spinner Container */}
      <div className="loading-screen__spinner-container absolute inset-0 flex justify-center items-center">
        {/* Animated Spinner Circle */}
        <div className="loading-screen__spinner w-48 h-48 rounded-full border-t-4 border-blue-500 animate-spin"></div>
      </div>
    </div>
  );
}

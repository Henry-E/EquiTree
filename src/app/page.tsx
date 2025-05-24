"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleConnect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length) router.push('/dashboard');
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  return (
    <div className="relative z-0 min-h-screen bg-gradient-to-br from-lavenderMist to-cream overflow-hidden">
      <main className="relative z-10 container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-6xl font-header text-charcoal">Your apps. Your equity. Your income.</h1>
        <p className="mt-4 text-lg text-dustyPlum">Turn everyday digital interactions into ownership and monthly dividends</p>
        {/* How It Works */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div className="bg-gradient-to-br from-white to-lavenderMist shadow-md p-6 rounded-2xl flex flex-col items-center">
            <div className="text-4xl">📱</div>
            <h3 className="mt-4 text-xl font-header text-charcoal">Use Apps You Love</h3>
            <p className="mt-2 text-sm text-dustyPlum text-center">Continue using your favorite platforms normally.</p>
          </div>
          <div className="bg-gradient-to-br from-white to-lavenderMist shadow-md p-6 rounded-2xl flex flex-col items-center">
            <div className="text-4xl">🌱</div>
            <h3 className="mt-4 text-xl font-header text-charcoal">Earn Ownership Shares</h3>
            <p className="mt-2 text-sm text-dustyPlum text-center">Every interaction grows your stake over time.</p>
          </div>
          <div className="bg-gradient-to-br from-white to-lavenderMist shadow-md p-6 rounded-2xl flex flex-col items-center">
            <div className="text-4xl">🔄</div>
            <h3 className="mt-4 text-xl font-header text-charcoal">Receive Continuous Dividends</h3>
            <p className="mt-2 text-sm text-dustyPlum text-center">Payouts flow continuously from decentralized sources.</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-header text-charcoal">Ready to join the ownership economy?</h2>
          <button onClick={handleConnect} className="mt-4 inline-flex items-center px-6 py-3 rounded-full bg-peachPink text-background text-lg font-semibold shadow-lg hover:shadow-2xl transition">
            Connect Wallet
          </button>
        </div>
      </main>
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="animated-blob blob1"></div>
        <div className="animated-blob blob2"></div>
        <div className="animated-blob blob3"></div>
        <div className="animated-blob blob4"></div>
      </div>
      <style jsx global>{`
        .animated-blob {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.4;
          will-change: transform, opacity;
        }
        .blob1 {
          background: radial-gradient(circle, #F8F5FF 20%, transparent 70%);
          top: -100px;
          left: -100px;
          animation: blob1Anim 30s ease-in-out infinite;
        }
        .blob2 {
          background: radial-gradient(circle, #FFB5A7 20%, transparent 70%);
          top: 20%;
          right: -150px;
          animation: blob2Anim 35s ease-in-out infinite;
        }
        .blob3 {
          background: radial-gradient(circle, #A8D5BA 20%, transparent 70%);
          bottom: -100px;
          left: 10%;
          animation: blob3Anim 40s ease-in-out infinite;
        }
        .blob4 {
          background: radial-gradient(circle, #8B7FB8 20%, transparent 70%);
          bottom: 10%;
          right: -100px;
          animation: blob4Anim 25s ease-in-out infinite;
        }
        @keyframes blob1Anim { 0%,100% { transform:translate(0,0) scale(1); opacity:0.2; } 50% { transform:translate(30px,20px) scale(1.3); opacity:0.6; } }
        @keyframes blob2Anim { 0%,100% { transform:translate(0,0) scale(1); opacity:0.2; } 50% { transform:translate(-30px,25px) scale(1.2); opacity:0.6; } }
        @keyframes blob3Anim { 0%,100% { transform:translate(0,0) scale(1); opacity:0.2; } 50% { transform:translate(25px,-30px) scale(1.3); opacity:0.6; } }
        @keyframes blob4Anim { 0%,100% { transform:translate(0,0) scale(1); opacity:0.2; } 50% { transform:translate(-20px,-20px) scale(1.2); opacity:0.6; } }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Platform model and initial mock data
interface Platform { name: string; shares: number; amount: number; rate: number; }
const initialPlatforms: Platform[] = [
  { name: "Spotify", shares: 2847, amount: 156.32, rate: 0.00005 },
  { name: "Lens Protocol", shares: 1298, amount: 120.45, rate: 0.00005 },
  { name: "Aave", shares: 578, amount: 98.76, rate: 0.00005 },
  { name: "ChatGPT", shares: 349, amount: 75.23, rate: 0.00005 },
  { name: "Midjourney", shares: 421, amount: 80.11, rate: 0.00005 },
  { name: "Mirror", shares: 212, amount: 50.67, rate: 0.00005 },
  { name: "Uniswap", shares: 875, amount: 130.89, rate: 0.00005 },
  { name: "OpenSea", shares: 932, amount: 140.34, rate: 0.00005 },
];

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [activeTab, setActiveTab] = useState<string>("Portfolio");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length) {
            setAddress(accounts[0]);
          } else {
            router.push("/");
          }
        })
        .catch(() => {
          router.push("/");
        });
    } else {
      alert("Please install MetaMask");
      router.push("/");
    }
  }, [router]);

  // smooth continuous streaming & aggregated total via rAF
  const totalRate = platforms.reduce((sum, p) => sum + p.rate, 0);
  const totalEarnings = platforms.reduce((sum, p) => sum + p.amount, 0);
  const SECONDS_PER_MONTH = 30 * 24 * 3600;
  const monthlyEstimate = totalRate * SECONDS_PER_MONTH;
  const portfolioValue = monthlyEstimate * 120;
  const [displayTotal, setDisplayTotal] = useState<number>(0);
  // initialize displayTotal on client to avoid SSR mismatch
  useEffect(() => {
    setDisplayTotal(Math.random() * 200 + 200);
  }, []);
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setPlatforms(prev => prev.map(p => ({ ...p, amount: p.amount + p.rate * dt })));
      setDisplayTotal(prev => prev + totalRate * dt);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [totalRate]);

  const handleClaim = () => {
    alert(`Claimed $${displayTotal.toFixed(4)}`);
    setPlatforms(prev => prev.map(p => ({ ...p, amount: 0 })));
    setDisplayTotal(0);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <nav className="bg-lavenderMist py-4 shadow">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="text-2xl font-bold text-iris">EquiTree</div>
          <ul className="flex space-x-6 font-medium">
            <li onClick={() => setActiveTab("Portfolio")} className={`px-3 py-1 rounded-full ${activeTab === "Portfolio" ? "bg-iris bg-opacity-20 text-iris" : "hover:bg-grayDiv"}`}>Portfolio</li>
            <li onClick={() => setActiveTab("Activity")} className={`px-3 py-1 rounded-full ${activeTab === "Activity" ? "bg-iris bg-opacity-20 text-iris" : "hover:bg-grayDiv"}`}>Activity</li>
            <li onClick={() => setActiveTab("Rewards")} className={`px-3 py-1 rounded-full ${activeTab === "Rewards" ? "bg-iris bg-opacity-20 text-iris" : "hover:bg-grayDiv"}`}>Rewards</li>
          </ul>
          <div className="flex items-center space-x-2 bg-grayDiv p-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-emerald"></div>
            <span className="font-mono text-sm">{address?.slice(0,6)}...{address?.slice(-4)}</span>
          </div>
        </div>
      </nav>
      <header className="container mx-auto px-6 mt-6">
        <div className="bg-gradient-to-r from-sageMint to-emerald text-background rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-header">Welcome back, Alex!</h2>
          </div>
          <button onClick={handleClaim} className="bg-peachPink text-background px-4 py-2 rounded-full font-semibold shadow hover:shadow-lg transition">
            Claim Earnings: ${displayTotal.toFixed(4)}
          </button>
        </div>
      </header>
      {/* Content Areas */}
      {activeTab === "Portfolio" && (
        <>
          <section className="container mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Value Card */}
            <div className="bg-cream rounded-2xl p-6 shadow-lg lg:col-span-3">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-dustyPlum">Expected monthly income</p>
                  <p className="text-4xl font-bold mt-1">${Math.round(monthlyEstimate).toLocaleString()}</p>
                  <p className="text-sm text-dustyPlum mt-4">Total portfolio value</p>
                  <p className="text-2xl font-bold mt-1">${Math.round(portfolioValue).toLocaleString()}</p>
                </div>
              </div>
            </div>
            {/* Platform Cards */}
            {platforms.map((p, index) => (
              <div key={index} className="bg-cream rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">{p.name[0]}</div>
                  <h3 className="font-medium text-charcoal">{p.name}</h3>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-mono">{p.shares.toLocaleString()} shares</p>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-xs text-dustyPlum">Asset Value</p>
                      <p className="text-lg font-semibold">${(p.rate * SECONDS_PER_MONTH * 120).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald">Streamed Earned</p>
                      <p className="text-lg font-semibold text-emerald">${p.amount.toFixed(4)}</p>
                      <p className="text-xs text-emerald mt-1">+${p.rate.toFixed(4)}/s</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-gray-200 h-2 rounded-full">
                  <div className="bg-iris h-2 rounded-full" style={{ width: `${totalEarnings > 0 ? ((p.amount / totalEarnings) * 100).toFixed(2) : 0}%` }}></div>
                </div>
                <button className="mt-4 text-sm text-iris font-medium">View activity →</button>
              </div>
            ))}
          </section>
        </>
      )}
      {activeTab === "Activity" && (
        <section className="container mx-auto px-6 mt-6">
          <h2 className="text-2xl font-header">Activity</h2>
          <p className="text-sm text-dustyPlum mt-2">Recent interactions will appear here.</p>
        </section>
      )}
      {activeTab === "Rewards" && (
        <section className="container mx-auto px-6 mt-6">
          <h2 className="text-2xl font-header">Rewards</h2>
          <p className="text-sm text-dustyPlum mt-2">Your accrued rewards info will appear here.</p>
        </section>
      )}
    </div>
  );
}

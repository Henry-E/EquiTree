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
  const [history, setHistory] = useState<{ date: string; amount: number; ipfsHash: string }[]>([]);
  const [claimData, setClaimData] = useState<{ date: string; amount: number; ipfsHash: string } | null>(null);
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
    const hash = "ipfs://Qm3x8f9...";
    const date = new Date().toLocaleString();
    setHistory(prev => [...prev, { date, amount: displayTotal, ipfsHash: hash }]);
    setClaimData({ date, amount: displayTotal, ipfsHash: hash });
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
            <li onClick={() => setActiveTab("History")} className={`px-3 py-1 rounded-full ${activeTab === "History" ? "bg-iris bg-opacity-20 text-iris" : "hover:bg-grayDiv"}`}>History</li>
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
              <div key={index} className="bg-cream rounded-2xl p-6 shadow-md hover:shadow-lg transition relative group">
                <div className="absolute top-2 right-2">
                  <svg width="24" height="24" viewBox="0 0 100 100" className="cursor-help transition-transform hover:scale-110">
                    <title>Powered by Chainlink oracles</title>
                    <polygon points="50 0 93.3 25 93.3 75 50 100 6.7 75 6.7 25" fill="#375BD2" />
                  </svg>
                  <div className="absolute top-6 right-0 w-40 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity p-1">Powered by Chainlink oracles</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">{p.name[0]}</div>
                  <h3 className="font-medium text-charcoal">{p.name}</h3>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-mono animate-pulse">{p.shares.toLocaleString()} shares</p>
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
      {activeTab === "History" && (
        <section className="container mx-auto px-6 mt-6">
          <h2 className="text-2xl font-header">Dividend History (Stored on Filecoin)</h2>
          <ul className="mt-4 space-y-2">
            {history.length ? history.map((entry, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-filecoin rounded-full"></div>
                <div>
                  <p>{entry.date}: ${entry.amount.toFixed(4)}</p>
                  <button onClick={() => alert('Coming soon')} className="text-xs text-filecoin hover:underline">View on IPFS</button>
                </div>
              </li>
            )) : <p className="text-sm text-dustyPlum mt-2">No history yet.</p>}
          </ul>
        </section>
      )}
      {claimData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2"> Permanent Record Created</h3>
            <p className="mb-4">Your dividend receipt has been stored on Filecoin</p>
            <div className="bg-gray-100 p-2 rounded mb-2">
              <span className="font-mono">{claimData.ipfsHash}</span>
              <button onClick={() => navigator.clipboard.writeText(claimData.ipfsHash)} className="ml-2 text-sm text-filecoin hover:underline">Copy</button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-filecoin rounded"></div>
              <span className="ml-2">Secured by Filecoin</span>
            </div>
            <button onClick={() => setClaimData(null)} className="mt-2 px-4 py-2 bg-emerald text-white rounded">Close</button>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6 mt-12 text-center py-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-filecoin rounded"></div>
          <span className="font-medium">Your records are permanently stored on Filecoin</span>
        </div>
        <p className="mt-2 text-sm text-filecoin">Permanent, censorship-resistant storage via Filecoin</p>
        <a href="#" className="inline-block mt-2 text-sm text-filecoin hover:underline">Learn about Filecoin storage →</a>
      </div>
    </div>
  );
}

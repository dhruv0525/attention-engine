"use client";

import { useEffect, useState } from "react";
import { getStats, getTrackingMode, getAttentionScore } from "@/lib/tracker";

export default function StatsPanel() {
  const [data, setData] = useState<any>({});
  const [mode, setMode] = useState("manipulative");

  useEffect(() => {
    const interval = setInterval(() => {
      setData({ ...getStats() });
      setMode(getTrackingMode());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-sm w-64 z-50">
      <h2 className="font-bold mb-1">📊 Stats</h2>
      <p className="mb-1 text-xs font-mono uppercase text-gray-400">Mode: <span className={mode === 'ethical' ? 'text-green-400' : 'text-red-400'}>{mode}</span></p>
      <p className="mb-4 text-xs font-mono text-gray-400">Attention Damage: {(getAttentionScore() / 1000).toFixed(2)}s avg</p>

      {Object.entries(data).map(([id, stat]: any) => (
        <div key={id} className="mb-2 border-b border-gray-600 pb-1">
          <p>Post {id}</p>
          <p>Views: {stat.views}</p>
          <p>Clicks: {stat.clicks}</p>
          <p>Time: {(stat.totalTime / 1000).toFixed(2)}s</p>
        </div>
      ))}
    </div>
  );
}

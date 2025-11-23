"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FilterBarProps {
  defaultType?: string; // 'buy' | 'rent'
}

export default function FilterBar({ defaultType = "buy" }: FilterBarProps) {
  const router = useRouter();
  const [meter, setMeter] = useState("");

  const doSearch = () => {
    const params = new URLSearchParams();
    if (meter) params.append("meter", meter);

    // مسیر بر اساس نوع معامله
    const path = defaultType === "rent" ? "/rent" : "/sale";
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded-xl shadow-md">
      <input
        type="number"
        placeholder="حداقل متراژ (متر)"
        value={meter}
        onChange={(e) => setMeter(e.target.value)}
        className="px-4 py-2 rounded-xl border border-gray-300 w-52 outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={doSearch}
        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
      >
        جستجو
      </button>
    </div>
  );
}

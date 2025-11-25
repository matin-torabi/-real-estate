"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

interface FilterBarProps {
  defaultType?: string;
}

export default function FilterBar({ defaultType = "buy" }: FilterBarProps) {
  const router = useRouter();
  const [meter, setMeter] = useState("");
  const pathName = usePathname();

  const doSearch = () => {
    const params = new URLSearchParams();
    if (meter) params.append("meter", meter);

    const path = defaultType === "rent" ? "/rent" : "/sale";
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div
      className={
        pathName === "/"
          ? "hidden"
          : "flex items-center justify-center gap-4 p-4"
      }
    >
      <input
        type="number"
        placeholder="حداقل متراژ (متر)"
        value={meter}
        onChange={(e) => setMeter(e.target.value)}
        className="px-2 mobile:py-1.5 desktop:py-2 text-xl text-[#2b2b2b] rounded border border-gray-300 mobile:w-[200px] laptop:w-[240px] desktop:w-[300px] outline-none focus:ring-2 focus:ring-[#DC143C]"
      />

      <button
        onClick={doSearch}
        className="mobile:px-3 desktop:px-5 py-2.5 flex gap-2 items-center bg-[#DC143C] mobile:text-sm desktop:text-[16px] text-white rounded hover:bg-[#DC143C] transition-all cursor-pointer"
      >
        جستجو
        <IoSearch />
      </button>
    </div>
  );
}

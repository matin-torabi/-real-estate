"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/properties?limit=20"); // بیشتر برای اسلایدر
    const data = await res.json();
    setList(data);
  }

  // جدا کردن آگهی‌ها بر اساس نوع
  const buyList = list.filter((p) => p.type === "buy");
  const rentList = list.filter((p) => p.type === "rent");

  const renderCard = (p: any) => (
    <div
      key={p.id}
      className="backdrop-blur-lg bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6 w-80 shadow-lg text-white flex-shrink-0"
    >
      {p.image && (
        <Image
          src={p.image}
          width={300}
          height={300}
          alt={p.title || "image"}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
      <p className="text-sm opacity-90 mb-2">
        <b>آدرس:</b> {p.address}
      </p>
      <p className="mb-2 leading-relaxed">{p.description}</p>
      <p className="text-sm mb-2">
        <b>متراژ:</b> {p.meter} متر
      </p>
      <p className="text-sm mb-2">
        <b>تلفن:</b> {p.phone}
      </p>
      {p.type === "buy" && (
        <p className="text-base font-semibold mb-1">
          <b>قیمت خرید:</b> {p.price.toLocaleString()} تومان
        </p>
      )}
      {p.type === "rent" && (
        <>
          <p className="text-sm mb-1">
            <b>رهن:</b> {p.deposit.toLocaleString()} تومان
          </p>
          <p className="text-sm">
            <b>اجاره:</b> {p.rent.toLocaleString()} تومان
          </p>
        </>
      )}
    </div>
  );

  return (
    <div>
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold">بهترین خانه‌ها، نزدیک شما</h1>
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/sale"
            className="bg-white text-blue-700 px-6 py-2 rounded-xl font-semibold shadow-md"
          >
            خرید خانه
          </Link>
          <Link
            href="/rent"
            className="bg-white text-green-700 px-6 py-2 rounded-xl font-semibold shadow-md"
          >
            اجاره خانه
          </Link>
        </div>
      </div>

      {/* اسلایدر خرید */}
      {buyList.length > 0 && (
        <div className="p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">خانه‌های برای فروش</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {buyList.map(renderCard)}
          </div>
        </div>
      )}

      {/* اسلایدر اجاره */}
      {rentList.length > 0 && (
        <div className="p-6 max-w-7xl mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">خانه‌های برای اجاره</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {rentList.map(renderCard)}
          </div>
        </div>
      )}
    </div>
  );
}

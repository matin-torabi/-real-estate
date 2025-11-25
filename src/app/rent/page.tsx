"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterBar from "@/src/components/FilterBar";

interface Property {
  id: number;
  title: string;
  address: string;
  description: string;
  phone: string;
  price: number;
  rent: number;
  deposit: number;
  type: string;
  images: string[]; // فقط images
  meter: number;
}

export default function RentPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const meter = searchParams.get("meter") || "";

  const fetchData = async () => {
    let url = "/api/properties";
    const params = new URLSearchParams();
    params.append("type", "rent");
    if (q) params.append("q", q);
    if (meter) params.append("meter", meter);
    url += `?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    setProperties(data);
  };

  useEffect(() => {
    fetchData();
  }, [q, meter]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        آگهی‌های اجاره
      </h1>

      {/* FilterBar */}
      <div className="mobile:flex justify-center laptop:hidden mb-6">
        <FilterBar defaultType="rent" />
      </div>

      {/* لیست آگهی‌ها */}
      <div className="flex flex-wrap gap-6 justify-center">
        {properties.length > 0 ? (
          properties.map((p) => (
            <Link
              key={p.id}
              href={`/property/${p.id}`}
              className="backdrop-blur-lg bg-white rounded-2xl p-6 w-80 shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl block"
            >
              {p.images && p.images.length > 0 ? (
                <Image
                  src={p.images[0]} // فقط عکس اول
                  width={300}
                  height={300}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              ) : (
                <Image
                  src="/hero.jpg" // تصویر پیش‌فرض
                  width={300}
                  height={300}
                  alt="Default Image"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-sm opacity-90 mb-1">
                <b>آدرس:</b> {p.address}
              </p>
              <p className="mb-2 text-sm line-clamp-2">{p.description}</p>
              <p className="text-sm mb-1">
                <b>متراژ:</b> {p.meter} متر
              </p>
              <p className="text-sm mb-2">
                <b>تلفن:</b> {p.phone}
              </p>
              {p.type === "buy" ? (
                <p className="text-base font-semibold mb-1">
                  <b>قیمت خرید:</b> {p.price ? p.price.toLocaleString() : "-"} تومان
                </p>
              ) : (
                <>
                  <p className="text-sm mb-1">
                    <b>رهن:</b> {p.deposit ? p.deposit.toLocaleString() : "-"} تومان
                  </p>
                  <p className="text-sm mb-2">
                    <b>اجاره ماهیانه:</b> {p.rent ? p.rent.toLocaleString() : "-"} تومان
                  </p>
                </>
              )}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            هیچ آگهی‌ای برای اجاره پیدا نشد
          </p>
        )}
      </div>
    </div>
  );
}

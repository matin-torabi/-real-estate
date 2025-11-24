"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export interface Property {
  id: number;
  title: string;
  address: string;
  description: string;
  phone: string;
  price: number;
  rent: number;
  deposit: number;
  type: string;
  images: string[];
  meter: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!params.id) return;
    fetchProperty(params.id);
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    const res = await fetch(`/api/properties/${id}`);
    if (!res.ok) {
      console.error("آگهی پیدا نشد");
      return;
    }
    const data = await res.json();

    if (typeof data.images === "string") {
      data.images = JSON.parse(data.images);
    }

    setProperty(data);
  };

  if (!property) {
    return <div className="text-center py-20 text-gray-700">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
      >
        ← بازگشت
      </button>

      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-2">{property.address}</p>
      <p className="text-gray-500 mb-2">{property.meter} متر</p>

      {property.images && property.images.length > 0 && (
        <div className="mb-6 w-full">
          {/* عکس اصلی */}
          <div className="relative w-full h-96 mb-2">
            <Image
              src={property.images[index]}
              alt={property.title}
              fill
              className="object-cover rounded-xl"
            />

            {/* دکمه عقب */}
            <button
              onClick={() =>
                setIndex((i) => (i === 0 ? property.images.length - 1 : i - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              ←
            </button>

            {/* دکمه جلو */}
            <button
              onClick={() =>
                setIndex((i) => (i === property.images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              →
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 justify-center">
            {property.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-20 h-20 relative rounded-md border-2 cursor-pointer overflow-hidden ${
                  i === index ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mb-4">{property.description}</p>

      <div className="text-lg font-semibold mb-4">
        {property.type === "buy" ? (
          <p>قیمت خرید: {property.price.toLocaleString()} تومان</p>
        ) : (
          <>
            <p>رهن: {property.deposit.toLocaleString()} تومان</p>
            <p>اجاره ماهیانه: {property.rent.toLocaleString()} تومان</p>
          </>
        )}
      </div>

      <p className="text-gray-700 mb-4">📞 تماس: {property.phone}</p>
    </div>
  );
}

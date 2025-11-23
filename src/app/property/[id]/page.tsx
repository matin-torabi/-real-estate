"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
  image: string;
  meter: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);

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

      {property.image && (
        <div className="w-full h-80 relative mb-6">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover rounded-xl"
          />
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

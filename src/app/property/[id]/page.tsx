"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoArrowBack } from "react-icons/io5";

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
    if (!res.ok) return console.error("آگهی پیدا نشد");

    const data = await res.json();
    if (typeof data.images === "string") {
      try {
        data.images = JSON.parse(data.images);
      } catch {
        data.images = [];
      }
    }
    if (!Array.isArray(data.images)) data.images = [];
    setProperty(data);
  };

  if (!property) {
    return (
      <div className="text-center py-20 text-gray-700">در حال بارگذاری...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-5">
      {/* دکمه بازگشت */}
      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 flex items-center gap-2.5"
        >
          بازگشت
          <IoArrowBack />
        </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row-reverse gap-6">
        {/* اطلاعات آگهی سمت راست */}
        <div className="flex-1 flex flex-col justify-between text-right">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-gray-600 mb-1">{property.address}</p>
            <p className="text-gray-500 mb-2">{property.meter} متر</p>
            <p className="text-gray-700 mb-4">{property.description}</p>
          </div>

          <div className="mb-4 text-lg font-semibold">
            {property.type === "buy" ? (
              <p> قیمت خرید: {property.price.toLocaleString()} تومان</p>
            ) : (
              <>
                <p> رهن: {property.deposit.toLocaleString()} تومان</p>
                <p> اجاره ماهیانه: {property.rent.toLocaleString()} تومان</p>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-2"> تماس: {property.phone}</p>
        </div>

        {/* اسلایدر تصاویر سمت چپ */}
        <div className="flex-1">
          {property.images.length > 0 ? (
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <Image
                src={property.images[index] || "/hero.jpg"}
                alt={property.title}
                fill
                className="object-cover"
              />

              <button
                onClick={() =>
                  setIndex((i) =>
                    i === 0 ? property.images.length - 1 : i - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <GrFormPrevious />
              </button>

              <button
                onClick={() =>
                  setIndex((i) =>
                    i === property.images.length - 1 ? 0 : i + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <MdNavigateNext />
              </button>
            </div>
          ) : (
            <Image
              src="/hero.jpg"
              alt="default"
              width={500}
              height={300}
              className="w-full h-96 object-cover rounded-xl"
            />
          )}

          <div className="flex gap-2 mt-3 overflow-x-auto justify-start md:justify-start">
            {property.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-20 h-20 relative rounded-md border-2 cursor-pointer overflow-hidden flex-shrink-0 ${
                  i === index ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <Image
                  src={img || "/hero.jpg"}
                  alt={`thumb-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

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
  image: string;
  meter: number;
}

export default function AdminPage() {
  const [form, setForm] = useState<any>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [counts, setCounts] = useState({ buy: 0, rent: 0 });

  const loadData = async () => {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);

    const buyCount = data.filter((p: Property) => p.type === "buy").length;
    const rentCount = data.filter((p: Property) => p.type === "rent").length;
    setCounts({ buy: buyCount, rent: rentCount });
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async () => {
    if (editMode) {
      await fetch(`/api/properties/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({});
    setShowFormModal(false);
    setEditMode(false);
    loadData();
  };

  const startEdit = (item: Property) => {
    setForm(item);
    setCurrentId(item.id);
    setEditMode(true);
    setShowFormModal(true);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("آیا از حذف این آگهی مطمئن هستید؟")) return;

    await fetch(`/api/properties/${id}`, {
      method: "DELETE",
    });
    loadData();
  };

  return (
    <div className="bg-gray-900 min-h-screen p-10 font-[Number] text-white">
      {/* عنوان صفحه */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">مدیریت آگهی‌ها</h1>

        <div className="mt-4 md:mt-0 flex gap-6 items-center">
          <span>تعداد فروش: {counts.buy}</span>
          <span>تعداد اجاره: {counts.rent}</span>
          <button
            onClick={() => {
              setForm({});
              setEditMode(false);
              setShowFormModal(true);
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all"
          >
            + افزودن آگهی
          </button>
        </div>
      </div>

      {/* لیست آگهی‌ها */}
      <div className="grid grid-cols-5 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p.id}
            className="bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col"
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-1">{p.title}</h3>
            <p className="text-gray-300 text-sm mb-1">{p.address}</p>
            <p className="text-gray-400 text-sm mb-1 line-clamp-2">
              {p.description}
            </p>
            <p className="text-gray-300 text-sm mb-1">متراژ: {p.meter} متر</p>
            <p className="text-gray-300 text-sm mb-1">📞 {p.phone}</p>
            <p className="text-gray-300 text-sm mb-2">
              نوع: {p.type === "buy" ? "فروش" : "اجاره"}
            </p>
            {p.type === "buy" && (
              <p className="text-base font-semibold mb-1">
                قیمت: {p.price?.toLocaleString()} تومان
              </p>
            )}
            {p.type === "rent" && (
              <>
                <p className="text-sm mb-1">رهن: {p.deposit?.toLocaleString()}</p>
                <p className="text-sm mb-2">اجاره: {p.rent?.toLocaleString()}</p>
              </>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => startEdit(p)}
                className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                ویرایش
              </button>
              <button
                onClick={() => deleteItem(p.id)}
                className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال فرم */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowFormModal(false)}
          />
          <div className="relative bg-gray-800 rounded-2xl p-8 w-full max-w-lg z-10 border border-gray-600/50">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">
              {editMode ? "ویرایش آگهی" : "ثبت آگهی جدید"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                className={inputClasses}
                placeholder="عنوان آگهی"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className={inputClasses}
                placeholder="آدرس ملک"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <textarea
              className={inputClasses + " min-h-20 resize-y mb-4"}
              placeholder="توضیحات کامل"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              className={inputClasses + " mb-4"}
              placeholder="متراژ (مثلاً 80)"
              value={form.meter || ""}
              onChange={(e) => setForm({ ...form, meter: e.target.value })}
            />
            <input
              className={inputClasses + " mb-4"}
              placeholder="شماره تماس"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                className={inputClasses}
                placeholder="قیمت خرید"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                className={inputClasses}
                placeholder="اجاره ماهیانه"
                value={form.rent || ""}
                onChange={(e) => setForm({ ...form, rent: e.target.value })}
              />
              <input
                className={inputClasses}
                placeholder="مبلغ رهن"
                value={form.deposit || ""}
                onChange={(e) => setForm({ ...form, deposit: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                className={inputClasses}
                value={form.type || ""}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">نوع معامله</option>
                <option value="buy">فروش</option>
                <option value="rent">اجاره</option>
              </select>

              <input
                className={inputClasses}
                placeholder="لینک عکس"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
              >
                انصراف
              </button>

              <button
                onClick={submit}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
              >
                {editMode ? "ذخیره تغییرات" : "ثبت آگهی"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClasses =
  "w-full p-3 rounded-xl border border-gray-600/40 bg-gray-700/30 text-white outline-none backdrop-blur-sm text-base transition-all duration-300 focus:ring-2 focus:ring-gray-500";

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";

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

export default function AdminPage() {
  const [form, setForm] = useState<any>({ images: [], rawFiles: [] });
  const [properties, setProperties] = useState<Property[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [counts, setCounts] = useState({ buy: 0, rent: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
    setCounts({
      buy: data.filter((p: Property) => p.type === "buy").length,
      rent: data.filter((p: Property) => p.type === "rent").length,
    });
  };

  const uploadImages = async (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.urls || [];
  };

  const submit = async () => {
    try {
      let imageUrls: string[] = [];

      if (form.rawFiles && form.rawFiles.length > 0) {
        const uploaded = await uploadImages(form.rawFiles);
        imageUrls = [
          ...(form.images && Array.isArray(form.images)
            ? form.images.filter((x: string) => !x.startsWith("blob:"))
            : []),
          ...uploaded,
        ];
      } else if (form.images) {
        imageUrls = form.images.filter((x: string) => !x.startsWith("blob:"));
      }

      const payload = {
        title: form.title || "",
        address: form.address || "",
        description: form.description || "",
        phone: form.phone || "",
        price: Number(form.price) || 0,
        rent: Number(form.rent) || 0,
        deposit: Number(form.deposit) || 0,
        type: form.type || "",
        images: imageUrls,
        meter: Number(form.meter) || 0,
      };

      const res = await fetch(
        editMode ? `/api/properties/${currentId}` : "/api/properties",
        {
          method: editMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Save failed");
      }

      setForm({ images: [], rawFiles: [] });
      setShowFormModal(false);
      setEditMode(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert("خطا: " + (err.message || "مشکلی پیش آمد"));
    }
  };

  const startEdit = (item: Property) => {
    setForm({ ...item, rawFiles: [] });
    setCurrentId(item.id);
    setEditMode(true);
    setShowFormModal(true);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("آیا از حذف این آگهی مطمئن هستید؟")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setForm({
      ...form,
      images: [...(form.images || []), ...previews],
      rawFiles: [...(form.rawFiles || []), ...filesArray],
    });
  };

  const removeImageFromForm = (index: number) => {
    const imgs = [...form.images];
    const rawFiles = [...(form.rawFiles || [])];
    const removed = imgs.splice(index, 1)[0];

    if (removed.startsWith("blob:") && index < rawFiles.length) {
      rawFiles.splice(index, 1);
    }

    setForm({ ...form, images: imgs, rawFiles });
  };

  return (
    <div className="min-h-screen p-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">مدیریت آگهی‌ها</h1>
        <div className="mt-4 md:mt-0 flex gap-6 items-center">
          <span>تعداد فروش: {counts.buy}</span>
          <span>تعداد اجاره: {counts.rent}</span>
          <button
            onClick={() => {
              setForm({ images: [], rawFiles: [] });
              setEditMode(false);
              setShowFormModal(true);
            }}
            className="px-6 py-3 bg-[#0BA6DF] text-white hover:bg-white hover:text-[#0BA6DF] hover:border-[#0BA6DF] border border-white duration-300 cursor-pointer rounded"
          >
            + افزودن آگهی
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="mobile:w-full laptop:w-[85%] desktop:w-[60%]">
          <div className="grid laptop:grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-2 gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl p-4 shadow-lg flex flex-col"
              >
                {p.images?.[0] && (
                  <Image
                    src={p.images[0] || "/hero.jpg"}
                    alt={p.title || "Property Image"}
                    width={300}
                    height={220}
                    className="w-full h-48 sm:h-52 md:h-60 lg:h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                <p className="text-sm mb-1">{p.address}</p>
                <p className="text-sm mb-1 line-clamp-2">{p.description}</p>
                <p className="text-sm mb-1">متراژ: {p.meter} متر</p>
                <p className="text-sm mb-1">{p.phone}</p>
                <p className="text-sm mb-2">
                  نوع: {p.type === "buy" ? "فروش" : "اجاره"}
                </p>
                {p.type === "buy" && (
                  <p className="text-base font-semibold mb-1">
                    قیمت: {p.price?.toLocaleString()} تومان
                  </p>
                )}
                {p.type === "rent" && (
                  <>
                    <p className="text-sm mb-1">
                      رهن: {p.deposit?.toLocaleString()}
                    </p>
                    <p className="text-sm mb-2">
                      اجاره: {p.rent?.toLocaleString()}
                    </p>
                  </>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-4 py-2 bg-[#0BA6DF] text-white duration-300 cursor-pointer rounded hover:bg-white hover:text-[#0BA6DF] hover:border-[#0BA6DF] border border-white"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => deleteItem(p.id)}
                    className="px-4 py-2 bg-[#DC143C] text-white duration-300 cursor-pointer rounded hover:bg-white hover:text-[#DC143C] hover:border-[#DC143C] border border-white"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowFormModal(false)}
          />
          <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-lg z-10">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">
              {editMode ? "ویرایش آگهی" : "ثبت آگهی جدید"}
            </h2>

            {/* فرم ورودی */}
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
                type="file"
                className={inputClasses}
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {form.images && form.images.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {form.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="w-20 h-20 relative rounded-md overflow-hidden border"
                  >
                    {img.startsWith("blob:") ? (
                      <Image
                        src={img}
                        alt="preview"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full rounded-md"
                      />
                    ) : (
                      <Image
                        src={img}
                        alt="preview"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full rounded-md"
                        unoptimized
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeImageFromForm(i)}
                      className="absolute -top-1 -right-1 text-red-500 cursor-pointer flex justify-center items-center rounded-full w-6 h-6 text-2xl"
                    >
                      <TiDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-6 py-3 bg-[#DC143C] text-white duration-300 cursor-pointer rounded hover:bg-white hover:text-[#DC143C] hover:border-[#DC143C] border border-white"
              >
                انصراف
              </button>
              <button
                onClick={submit}
                className="px-6 py-3 bg-[#0BA6DF] text-white hover:bg-white hover:text-[#0BA6DF] hover:border-[#0BA6DF] border border-white duration-300 cursor-pointer rounded"
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

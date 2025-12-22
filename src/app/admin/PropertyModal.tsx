"use client";

import { supabase } from "@/src/lib/supabase";
import { PropertyModalProps } from "@/src/types/property";
import { useState, useEffect } from "react";

const PropertyModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: PropertyModalProps) => {
  const [formData, setFormData] = useState({
    type: "buy",
    title: "",
    address: null,
    description: null,
    phone: null,
    price: null,
    rent: null,
    deposit: null,
    images: [],
    meter: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  
  // اگر در حالت ویرایش هستیم، فرم را با داده اولیه پر کنیم
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        type: initialData.type || "buy",
        title: initialData.title || "",
        address: initialData.address || null,
        description: initialData.description || null,
        phone: initialData.phone || null,
        price: initialData.price || null,
        rent: initialData.rent || null,
        deposit: initialData.deposit || null,
        images: initialData.images || [],
        meter: initialData.meter || null,
      });
    }
  }, [isEditing, initialData]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        type: "buy",
        title: "",
        address: null,
        description: null,
        phone: null,
        price: null,
        rent: null,
        deposit: null,
        images: [],
        meter: null,
      });
      setUploadProgress(0);
    }
  }, [isOpen]);

  const showPriceFields = () => {
    switch (formData.type) {
      case "buy":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              قیمت فروش (تومان) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              min="0"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        );

      case "rent":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اجاره ماهانه (تومان) *
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent || ""}
                onChange={handleChange}
                min="0"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ودیعه (تومان) *
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit || ""}
                onChange={handleChange}
                min="0"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        price: null,
        rent: null,
        deposit: null,
      }));
      return;
    }

    // Handle numeric fields
    const numericFields = ["price", "rent", "deposit", "meter"];
    if (numericFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseFloat(value),
      }));
      return;
    }

    // Handle empty strings as null for optional fields
    const optionalFields = ["address", "description", "phone"];
    if (optionalFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // تابع آپلود تصاویر
  const uploadImagesToStorage = async (files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    return uploadedUrls;
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setUploadProgress(0);

    try {
      const imageUrls = await uploadImagesToStorage(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("خطا در آپلود تصاویر");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `properties/${fileName}`;

      const { error } = await supabase.storage
        .from("property-images")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting image:", error);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index) || [],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = (): boolean => {
    // اعتبارسنجی فیلدهای اجباری عمومی
    if (!formData.title.trim()) {
      alert("لطفا عنوان را وارد کنید");
      return false;
    }

    if (!formData.meter || formData.meter <= 0) {
      alert("لطفا متراژ را وارد کنید");
      return false;
    }

    // اعتبارسنجی قیمت بر اساس نوع معامله
    if (formData.type === "buy") {
      if (!formData.price || formData.price <= 0) {
        alert("لطفا قیمت فروش را وارد کنید");
        return false;
      }
    } else if (formData.type === "rent") {
      if (!formData.rent || formData.rent <= 0) {
        alert("لطفا اجاره ماهانه را وارد کنید");
        return false;
      }
      if (!formData.deposit || formData.deposit <= 0) {
        alert("لطفا ودیعه را وارد کنید");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی فرم
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // ایجاد slug
      const slug =
        formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-")
          .trim() +
        "-" +
        Date.now();

      // ساختار داده بر اساس نوع معامله
      let propertyData: Record<string, any> = {
        type: formData.type,
        title: formData.title,
        slug: slug,
        meter: formData.meter,
        address: formData.address,
        description: formData.description,
        phone: formData.phone,
        images: formData.images,
      };

      // اضافه کردن فیلدهای قیمت بر اساس نوع
      if (formData.type === "buy") {
        propertyData.price = formData.price;
        propertyData.rent = null; // برای خرید، اجاره null باشد
        propertyData.deposit = null; // برای خرید، ودیعه null باشد
      } else if (formData.type === "rent") {
        propertyData.rent = formData.rent;
        propertyData.deposit = formData.deposit;
        propertyData.price = null; // برای اجاره، قیمت null باشد
      }

      // اضافه کردن created_at فقط برای رکوردهای جدید
      if (!isEditing) {
        propertyData.created_at = new Date().toISOString();
      }

      console.log("📤 ارسال داده به Supabase:", propertyData);

      if (isEditing && initialData?.id) {
        // ویرایش رکورد موجود
        const { data, error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", initialData.id)
          .select();

        if (error) throw error;
      } else {
        // ایجاد رکورد جدید
        const { data, error } = await supabase
          .from("properties")
          .insert([propertyData])
          .select();

        if (error) throw error;
      }

      onSubmit(formData);
      alert(
        isEditing ? "اطلاعات با موفقیت ویرایش شد!" : "اطلاعات با موفقیت ثبت شد!"
      );
      onClose();
    } catch (error: any) {
      console.error("❌ خطا در ذخیره:", error);

      let errorMessage = "خطا در ذخیره اطلاعات در پایگاه داده";

      // نمایش خطای دقیق‌تر
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }

      // اگر خطا مربوط به ستون missing است
      if (error.message?.includes("column")) {
        errorMessage +=
          "\n\nستونی در دیتابیس وجود ندارد. لطفاً ساختار جدول را بررسی کنید.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? "ویرایش اطلاعات ملک" : "ثبت اطلاعات ملک"}
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loading Indicator */}
            {loading && (
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-600">
                    {isEditing
                      ? "در حال ویرایش اطلاعات..."
                      : "در حال ذخیره اطلاعات..."}
                  </span>
                </div>
              </div>
            )}

            {/* Required Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                اطلاعات اجباری
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع معامله *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="buy">فروش</option>
                    <option value="rent">اجاره</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    متراژ (متر مربع) *
                  </label>
                  <input
                    type="number"
                    name="meter"
                    value={formData.meter || ""}
                    onChange={handleChange}
                    min="1"
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="مثال: ۸۰"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="مثال: آپارتمان ۸۰ متری در شمال تهران"
                  />
                </div>

                {/* نمایش فیلدهای قیمت بر اساس نوع معامله */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showPriceFields()}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                اطلاعات تکمیلی
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس کامل
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    rows={2}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                    placeholder="مثال: تهران، پاسداران، خیابان..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تصاویر ملک
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    disabled={loading || uploadingImages}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />

                  {uploadingImages && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>در حال آپلود تصاویر...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        تصاویر آپلود شده ({formData.images.length} عدد)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`تصویر ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(img, index)}
                              disabled={loading}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات کامل
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                    placeholder="توضیحات کامل درباره ملک، امکانات، موقعیت و ..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-200 disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-200 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? "در حال ویرایش..." : "در حال ذخیره..."}
                  </>
                ) : isEditing ? (
                  "ویرایش آگهی"
                ) : (
                  "ثبت آگهی"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;

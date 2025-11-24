import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // تبدیل Blob به Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // ساخت مسیر آپلود
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  // ساخت نام فایل
  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;

  // ذخیره فایل
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // آدرس قابل دسترس در فرانت
  const url = `/uploads/${filename}`;

  return NextResponse.json({ url });
}

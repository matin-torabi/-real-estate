import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

// GET: دریافت لیست آگهی‌ها
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // buy | rent
  const q = url.searchParams.get("q");
  const meter = url.searchParams.get("meter");

  let sql = "SELECT * FROM properties WHERE 1=1";
  const params: any[] = [];

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  if (q) {
    sql += " AND (title LIKE ? OR address LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (meter) {
    sql += " AND meter >= ?";
    params.push(parseInt(meter));
  }

  sql += " ORDER BY id DESC";

  const [rows] = await db.query(sql, params);

  // تبدیل فیلد JSON تصاویر به آرایه
  const data = (rows as any[]).map((row) => ({
    ...row,
    images: row.images ? JSON.parse(row.images) : [],
  }));

  return NextResponse.json(data);
}

// POST: اضافه کردن آگهی جدید
export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    address,
    description,
    phone,
    price,
    rent,
    deposit,
    type,
    images,
    meter,
  } = body;

  await db.query(
    `INSERT INTO properties
      (title, address, description, phone, price, rent, deposit, type, images, meter)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      address,
      description,
      phone,
      price || 0,
      rent || 0,
      deposit || 0,
      type,
      JSON.stringify(images || []),
      meter || 0,
    ]
  );

  return NextResponse.json({ message: "آگهی با موفقیت اضافه شد" });
}

// PUT: ویرایش آگهی
export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // id آگهی
  if (!id) return NextResponse.json({ error: "آیدی آگهی مشخص نیست" }, { status: 400 });

  const body = await req.json();
  const {
    title,
    address,
    description,
    phone,
    price,
    rent,
    deposit,
    type,
    images,
    meter,
  } = body;

  await db.query(
    `UPDATE properties SET
      title=?, address=?, description=?, phone=?, price=?, rent=?, deposit=?, type=?, images=?, meter=?
      WHERE id=?`,
    [
      title,
      address,
      description,
      phone,
      price || 0,
      rent || 0,
      deposit || 0,
      type,
      JSON.stringify(images || []),
      meter || 0,
      id,
    ]
  );

  return NextResponse.json({ message: "آگهی با موفقیت ویرایش شد" });
}

// DELETE: حذف آگهی
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "آیدی آگهی مشخص نیست" }, { status: 400 });

  await db.query("DELETE FROM properties WHERE id=?", [id]);

  return NextResponse.json({ message: "آگهی حذف شد" });
}

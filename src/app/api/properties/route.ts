import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // buy | rent
  const q = url.searchParams.get("q");       // جستجوی متن
  const meter = url.searchParams.get("meter"); // حداقل متراژ

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

  return NextResponse.json(rows);
}


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
    image,
    meter,
  } = body;

  await db.query(
    `INSERT INTO properties 
  (title, address, description, phone, price, rent, deposit, type, image, meter)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      address,
      description,
      phone,
      price,
      rent,
      deposit,
      type,
      image,
      meter,
    ]
  );
  return NextResponse.json({ message: "اگهی اضافه شد" });
}

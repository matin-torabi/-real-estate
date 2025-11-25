import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        title,
        address,
        description,
        phone,
        price,
        rent,
        deposit,
        type,
        images,
        meter
      FROM properties
      ORDER BY id DESC
      LIMIT 9
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("DB ERROR:", JSON.stringify(err, null, 2));
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

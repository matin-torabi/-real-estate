import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

// GET /api/properties/:id
export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);

    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [rows] = await db.query("SELECT * FROM properties WHERE id = ?", [
      id,
    ]);

    if ((rows as any).length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/properties/:id
export async function PUT(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

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
      `UPDATE properties 
       SET title=?, address=?, description=?, phone=?, price=?, rent=?, deposit=?, type=?, image=?, meter=? 
       WHERE id=?`,
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
        id,
      ]
    );

    return NextResponse.json({ message: "آگهی با موفقیت ویرایش شد" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/properties/:id
export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await db.query("DELETE FROM properties WHERE id = ?", [id]);

    return NextResponse.json({ message: "آگهی با موفقیت حذف شد" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const storagePath = `documents/${filename}`;

  const admin = getAdminSupabaseClient();
  const upload = await admin.storage.from("documents").upload(filename, buffer, {
    upsert: true,
    contentType: file.type,
  });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  return NextResponse.json({ path: storagePath });
}

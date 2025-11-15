import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const admin = getAdminSupabaseClient();
  const { data, error } = await admin
    .from("caltrans_invoices")
    .select("*, projects(name, code)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const doc = new PDFDocument({ margin: 48 });
  const chunks: Uint8Array[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(18).text("LAPM 5-A Invoice", { align: "center" }).moveDown();
  doc.fontSize(12).text(`Project: ${data.projects?.name ?? "Unknown"}`);
  doc.text(`Phase: ${data.phase}`);
  doc.text(`Invoice #: ${data.invoice_number}`);
  doc.text(`Period: ${data.period_start} to ${data.period_end}`);
  doc.moveDown();
  doc.text(`Total amount: $${Number(data.total_amount ?? 0).toLocaleString()}`);
  doc.text(`Federal share: $${Number(data.federal_share ?? 0).toLocaleString()}`);
  doc.text(`State share: $${Number(data.state_share ?? 0).toLocaleString()}`);
  doc.text(`Local share: $${Number(data.local_share ?? 0).toLocaleString()}`);
  doc.moveDown();
  doc.text(`Status: ${data.status}`);
  if (data.document_url) {
    doc.text(`Supporting docs: ${data.document_url}`);
  }
  doc.end();

  await new Promise((resolve) => doc.on("end", resolve));
  const pdfBuffer = Buffer.concat(chunks);
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${data.invoice_number}.pdf"`,
    },
  });
}

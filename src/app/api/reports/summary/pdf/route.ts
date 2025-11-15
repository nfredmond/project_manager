import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = getAdminSupabaseClient();
  const [{ data: projects }, { data: grants }] = await Promise.all([
    admin.from("projects").select("name, budget, spent"),
    admin.from("grants").select("name, stage, requested_amount"),
  ]);
  const projectList = projects ?? [];
  const grantList = grants ?? [];

  const totalBudget = projectList.reduce((sum, project) => sum + Number(project.budget ?? 0), 0);
  const totalSpent = projectList.reduce((sum, project) => sum + Number(project.spent ?? 0), 0);
  const activeGrants = grantList.filter((grant) => !["awarded", "denied"].includes(grant.stage));

  const doc = new PDFDocument({ margin: 48 });
  const chunks: Uint8Array[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("PlanningOS Portfolio Summary", { align: "center" }).moveDown();
  doc.fontSize(12).text(`Report generated: ${new Date().toLocaleString()}`).moveDown();
  doc.fontSize(14).text("Key metrics").moveDown(0.5);
  doc.fontSize(12).text(`Projects: ${projectList.length}`);
  doc.text(`Total budget: $${totalBudget.toLocaleString()}`);
  doc.text(`Total spent: $${totalSpent.toLocaleString()}`);
  doc.text(`Burn rate: ${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%`).moveDown();
  doc.text(`Grants in pipeline: ${activeGrants.length}`);
  doc.text(`Requested amount: $${activeGrants
    .reduce((sum, grant) => sum + Number(grant.requested_amount ?? 0), 0)
    .toLocaleString()}`);

  doc.moveDown().fontSize(14).text("Top projects").moveDown(0.5);
  projectList
    .slice(0, 5)
    .forEach((project) =>
      doc
        .fontSize(12)
        .text(`${project.name} – Budget $${Number(project.budget ?? 0).toLocaleString()} / Spent $${Number(project.spent ?? 0).toLocaleString()}`),
    );

  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));
  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=portfolio-summary.pdf",
    },
  });
}

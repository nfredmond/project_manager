import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const hasCredentials = Boolean(process.env.E2E_SUPABASE_EMAIL && process.env.E2E_SUPABASE_PASSWORD);
const communitySlug = process.env.E2E_COMMUNITY_SLUG ?? "demo-mpo";

const gotoPath = async (page: Page, path = "/") => {
  const url = new URL(baseUrl);
  url.pathname = path.startsWith("/") ? path : `/${path}`;
  return page.goto(url.toString());
};

test("landing page renders marketing content", async ({ page }) => {
  await gotoPath(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/caltrans compliance/i);
});

test("auth login page loads", async ({ page }) => {
  if (baseUrl.includes("_vercel_share=")) {
    await gotoPath(page);
  }
  await gotoPath(page, "/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test.describe("authenticated smoke flow", () => {
  test.skip(!hasCredentials, "Set E2E_SUPABASE_EMAIL and E2E_SUPABASE_PASSWORD to run the full smoke flow.");

  test("login → create project → submit community input", async ({ page }) => {
    if (baseUrl.includes("_vercel_share=")) {
      await gotoPath(page);
    }
    await gotoPath(page, "/login");
    await page.getByLabel("Email").fill(process.env.E2E_SUPABASE_EMAIL as string);
    await page.getByLabel("Password").fill(process.env.E2E_SUPABASE_PASSWORD as string);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByRole("heading", { name: /caltrans & grants overview/i })).toBeVisible({ timeout: 20000 });

    await gotoPath(page, "/projects");
    await expect(page.getByRole("heading", { name: /projects & delivery/i })).toBeVisible();

    await page.getByRole("button", { name: /new project/i }).click();
    const dialog = page.getByRole("dialog", { name: /create project/i });
    await dialog.getByLabel("Name").fill(`Playwright project ${Date.now()}`);
    await dialog.getByLabel("Code").fill(`PW-${Math.floor(Math.random() * 1000)}`);
    await dialog.getByLabel("Budget").fill("1000000");
    await dialog.getByLabel("Summary").fill("Automated smoke project created via Playwright.");
    await dialog.getByRole("button", { name: /create project/i }).click();
    await expect(dialog).toBeHidden();

    await gotoPath(page, `/community/${communitySlug}`);
    const form = page.getByRole("form");
    await form.getByLabel("Category").fill("Playwright QA");
    await form.getByLabel("Description").fill("Automated smoke submission from Playwright.");
    await form.getByRole("button", { name: /submit input/i }).click();
    await expect(form.getByLabel("Category")).toHaveValue("");
  });
});

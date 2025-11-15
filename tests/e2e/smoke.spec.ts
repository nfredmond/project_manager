import { test, expect } from "@playwright/test";

test("landing page renders marketing content", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/project manager/i);
});

test("auth login page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

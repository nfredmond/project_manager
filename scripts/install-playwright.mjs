import { execSync } from "node:child_process";

const isCI = !!process.env.CI && process.env.CI !== "0";

if (isCI) {
  console.log("CI detected: skipping Playwright browser install.");
  process.exit(0);
}

try {
  execSync("npx playwright install --with-deps", { stdio: "inherit" });
} catch (error) {
  console.error("Failed to install Playwright browsers.", error);
  process.exit(1);
}


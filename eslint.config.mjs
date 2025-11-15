import tseslint from "typescript-eslint";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";

const tsConfigs = tseslint.configs.recommended;

const ignoreConfig = {
  ignores: [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**",
    "**/*.config.{js,cjs,mjs,ts}",
    "**/*.d.ts",
  ],
};

const nextCoreWebVitals = {
  files: ["**/*.{ts,tsx,js,jsx}"],
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
  settings: {
    next: {
      rootDir: ["./"],
    },
  },
};

const projectConfig = {
  files: ["**/*.{ts,tsx,js,jsx}"],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
};

export default [ignoreConfig, ...tsConfigs, nextCoreWebVitals, projectConfig];

import { defineConfig } from "eslint/config";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { eslint },
    extends: ["eslint/recommended"],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { tseslint },
    extends: ["tseslint/recommended"],
  },
  // tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // ... any rules you want
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
    // ... others are omitted for brevity
  },
  eslintConfigPrettier,
  // pluginReact.configs.flat.recommended,
]);

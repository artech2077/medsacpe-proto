import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Replaces eslint-config-next: its @next/eslint-plugin-next dependency pulls in
// fast-glob -> micromatch -> braces, which has an unpatched advisory
// (GHSA-vfj7-8cjw-p6xm). The rule sets below mirror what that config enabled
// (React, hooks incl. React Compiler rules, a11y, TypeScript) minus the Next-specific rules.
const eslintConfig = defineConfig([
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    plugins: { "jsx-a11y": jsxA11y },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
    },
  },
  globalIgnores([".next/**", ".vercel/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;

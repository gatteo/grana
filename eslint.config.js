// Mirrors the Luminars desktop gate: the React hooks rules are the point; the rest is the
// typescript-eslint recommended floor. Runs as `pnpm lint`.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "public/**", "shots/**", "scripts/**", "tools/design-sync/**", "ds-bundle/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["registry/**/*.{ts,tsx}", "playground/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);

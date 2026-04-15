import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Exclude all generated/auto-generated code from linting
    "src/generated/**",
    "**/generated/**",
  ]),
  {
    // Project-wide rule overrides for stricter code quality
    rules: {
      // Allow underscore-prefixed variables to be unused (standard TS pattern)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // Downgrade img warnings to off for pages that intentionally use <img>
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;

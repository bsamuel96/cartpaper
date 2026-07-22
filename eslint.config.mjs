import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/mockups/**",
      "artifacts/**",
      "coverage/**",
      "playwright-report/**"
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;

import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

const config = [
  { ignores: [".next/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals"),
  { files: ["src/features/planner/planner-ui.tsx", "src/features/social/social-ui.tsx"], rules: { "@next/next/no-img-element": "off" } },
];

export default config;

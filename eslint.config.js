import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginReact.configs.flat.recommended,
  { ignores: ["node_modules", "src/components/ui/**"] },

  // globalIgnores(["node_modules", "src/components/ui/*"]),
  {
    files: ["src/**/*.{js,mjs,cjs,jsx}"],
    plugins: { js, react: pluginReact },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  {
    files: ["**/{vite,tailwind}.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);

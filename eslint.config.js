import globals, { browser } from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
    env: {
      node: true,
      browser: true,
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];

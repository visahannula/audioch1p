import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactpkg from "eslint-plugin-react";
//import pluginReactConfig from "eslint-plugin-react/configs/recommended";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: 
    { parserOptions: { ecmaFeatures: { jsx: true } } },
    globals: globals.browser
  },
  pluginJs.configs.recommended,
  reactpkg.configs.recommended,
  ...tseslint.configs.recommended,
  //...fixupConfigRules(activeRulesConfig)
];
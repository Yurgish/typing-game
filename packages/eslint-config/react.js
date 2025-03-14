import baseConfig from "./base.js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react/destructuring-assignment": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-filename-extension": "off",
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
    },
  },
];

// export default tseslint.config(
//     { ignores: ['dist'] },
//     {
//       extends: [js.configs.recommended, ...tseslint.configs.recommended],
//       files: ['**/*.{ts,tsx}'],
//       languageOptions: {
//         ecmaVersion: 2020,
//         globals: globals.browser,
//       },
//       plugins: {
//         'react-hooks': reactHooks,
//         'react-refresh': reactRefresh,
//       },
//       rules: {
//         ...reactHooks.configs.recommended.rules,
//         'react-refresh/only-export-components': [
//           'warn',
//           { allowConstantExport: true },
//         ],
//       },
//     },
//   )

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import turbo from "eslint-plugin-turbo";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  js.configs.recommended,
  prettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turbo,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": "warn",
      "import/no-default-export": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    ignores: ["dist/**", "node_modules/**"],
  },
  // {
  //   overrides: [
  //     {
  //       files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
  //       rules: {
  //         "simple-import-sort/imports": [
  //           "error",
  //           {
  //             groups: [
  //               // Packages `react` related packages come first.
  //               ["^(react|next)", "^@?\\w"],
  //               // Internal packages.
  //               [
  //                 "^src(/.*|$)",
  //                 // Parent imports. Put `..` last.
  //                 "^\\.\\.(?!/?$)",
  //                 "^\\.\\./?$",
  //                 // Other relative imports. Put same-folder imports and `.` last.
  //                 "^\\./(?=.*/)(?!/?$)",
  //                 "^\\.(?!/?$)",
  //                 "^\\./?$",
  //                 // Images
  //                 "^(IMAGES)(/.*|$)",
  //               ],
  //               // Side effect imports.
  //               ["^\\u0000"],
  //               // Style imports.
  //               ["^.+\\.?(css)$"],
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //   ],
  // },
];

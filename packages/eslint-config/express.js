import baseConfig from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Express.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  ...baseConfig,
  {
    rules: {
      "no-console": "off",
      "import/prefer-default-export": "off",
    },
  },
];

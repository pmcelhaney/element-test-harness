/* eslint-disable sonarjs/no-duplicate-string */
"use strict";

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  extends: ["plugin:@walgreenshealth/recommended"],

  ignorePatterns: [
    "**/node_modules/**",
    "**/coverage/**",
    "**/reports/**",
    "**/.stryker-tmp/**",
  ],

  overrides: [
    {
      files: ["*.md/**/*.ts"],

      extends: [
        "plugin:@walgreenshealth/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],

      parser: "@typescript-eslint/parser",

      parserOptions: {
        project: undefined,
      },

      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "import/unambiguous": "off",
        "import/no-unresolved": "off",
        "no-magic-numbers": "off",
      },
    },

    {
      files: ["src/**/*.ts", "test/**/*.ts"],

      extends: [
        "plugin:@walgreenshealth/recommended",
        "plugin:@walgreenshealth/typescript",
      ],

      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: "module",
      },

      rules: {
        "func-style": "off",
        "import/no-default-export": "off",
        "import/no-namespace": "off",
        "max-len": ["error", { code: 150 }],
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-magic-numbers": "off",
      },
    },

    {
      files: ["**/*.cjs"],

      parserOptions: {
        sourceType: "script",
      },

      env: {
        node: true,
      },

      rules: {
        "import/no-commonjs": "off",
      },
    },
  ],

  plugins: ["@walgreenshealth/eslint-plugin"],
};

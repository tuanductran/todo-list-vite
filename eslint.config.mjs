import antfu from "@antfu/eslint-config";
import command from "eslint-plugin-command/config";

export default antfu(
  {
    react: true,
    unocss: true,
  },
  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    rules: {
      "antfu/if-newline": "off",
      "prefer-object-has-own": "error",
      "logical-assignment-operators": [
        "error",
        "always",
        { enforceForIfStatements: true },
      ],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "prefer-destructuring": [
        "error",
        { VariableDeclarator: { object: true } },
      ],
      "import/no-self-import": "error",
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "object",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "error",
      "no-negated-condition": "off",
      "unicorn/no-negated-condition": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
      "object-shorthand": ["error", "always"],
      "unicorn/prefer-regexp-test": "error",
      "unicorn/no-array-for-each": "error",
      "unicorn/prefer-string-replace-all": "error",
      "ts/prefer-for-of": "error",
      "ts/no-explicit-any": "off",
      "ts/no-non-null-assertion": "off",
      "ts/no-unsafe-assignment": "off",
      "ts/no-unused-vars": "error",
      "ts/no-var-requires": "off",
      "ts/ban-ts-comment": "off",
      "ts/no-unsafe-call": "off",
      "ts/no-unsafe-member-access": "off",
      "ts/no-inferrable-types": [
        "error",
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      "jsonc/sort-keys": "error",
      "style/semi": ["error", "always"],
      "style/quotes": ["error", "double"],
      "style/function-paren-newline": "off",
      "style/quote-props": "off",
      "style/arrow-parens": ["error", "always"],
      "style/brace-style": "off",
      "node/prefer-global/process": "off",
      "node/prefer-global/buffer": "off",
      "command/command": "error",
      "perfectionist/sort-imports": "off",
      "no-dupe-keys": "error",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]",
          message:
            "`useMemo` with an empty dependency array can't provide a stable reference, use `useRef` instead.",
        },
        {
          selector: "JSXIdentifier[name=\"React\"]",
          message:
            "Avoid using React directly. Consider using JSX without import.",
        },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off",
    },
  },
  command(),
);

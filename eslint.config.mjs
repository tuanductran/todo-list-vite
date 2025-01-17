import antfu from "@antfu/eslint-config";
import command from "eslint-plugin-command/config";

export default antfu(
  {
    react: true,
    unocss: true,
  },

  // Base Rules
  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    rules: {
      // Style Rules
      "style/semi": ["error", "always"],
      "style/quotes": ["error", "double"],
      "style/arrow-parens": ["error", "always"],

      // Import Rules
      "import/order": ["warn", {
        groups: ["object", "builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true }
      }],
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/no-self-import": "error",
      "import/newline-after-import": "error",

      // TypeScript Rules
      "ts/prefer-for-of": "error", 
      "ts/no-unused-vars": "error",
      "ts/no-inferrable-types": ["error", {
        ignoreParameters: true,
        ignoreProperties: true
      }],

      // Best Practices
      "prefer-object-has-own": "error",
      "object-shorthand": ["error", "always"],
      "no-dupe-keys": "error",
      "prefer-destructuring": ["error", { 
        VariableDeclarator: { object: true }
      }],
      "no-lonely-if": "error",
      "no-else-return": ["error", { allowElseIf: false }],

      // Disabled Rules
      "antfu/if-newline": "off",
      "ts/no-explicit-any": "off",
      "ts/no-non-null-assertion": "off",
      "node/prefer-global/process": "off",
      "node/prefer-global/buffer": "off",
      "perfectionist/sort-imports": "off"
    }
  },

  // React Rules
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]",
          message: "`useMemo` with empty deps should use `useRef` instead."
        }
      ]
    },
    settings: {
      react: { version: "detect" }
    }
  },

  // Declaration Files
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off"
    }
  },

  command()
);

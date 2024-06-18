const TAILWIND_CONFIG = {
  extends: ['plugin:tailwindcss/recommended'],
  rules: {
    'tailwindcss/classnames-order': 'off', // conflicts with prettier-plugin-tailwindcss
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-custom-classname': 'error'
  }
}

/** @type {import('eslint').Linter.Config} */
module.exports = {
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['vite-env.d.ts'],
  overrides: [
    // Rules for all files
    {
      files: '**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier'
      ],
      plugins: ['import', 'unicorn', 'sonarjs'],
      rules: {
        'prefer-object-has-own': 'error',
        'logical-assignment-operators': [
          'error',
          'always',
          { enforceForIfStatements: true }
        ],
        'no-else-return': ['error', { allowElseIf: false }],
        'no-lonely-if': 'error',
        'prefer-destructuring': [
          'error',
          { VariableDeclarator: { object: true } }
        ],
        'import/no-duplicates': 'error',
        'no-negated-condition': 'off',
        'unicorn/no-negated-condition': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'object-shorthand': ['error', 'always'],
        'unicorn/prefer-regexp-test': 'error',
        'unicorn/no-array-for-each': 'error',
        'unicorn/prefer-string-replace-all': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        quotes: ['error', 'single', { avoidEscape: true }], // Matches Prettier, but also replaces backticks
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_' // allow underscores in destructuring
          }
        ],
        'prefer-object-spread': 'error',
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'unicorn/prefer-at': 'error',
        'sonarjs/no-small-switch': 'error',
        'prefer-const': ['error', { destructuring: 'all' }],
        'unicorn/prefer-array-index-of': 'error',
        'sonarjs/no-unused-collection': 'error',
        // todo: enable
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    },
    // Rules for React files
    {
      files: '**',
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended'
      ],
      rules: {
        'react/prop-types': 'off',
        'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
        'react-hooks/exhaustive-deps': 'error',
        'react/self-closing-comp': 'error',
        'no-restricted-syntax': [
          'error',
          {
            // ❌ useMemo(…, [])
            selector:
              'CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]',
            message:
              "`useMemo` with an empty dependency array can't provide a stable reference, use `useRef` instead."
          }
        ],
        'react/jsx-filename-extension': [
          'error',
          { extensions: ['.tsx', '.jsx'], allow: 'as-needed' }
        ],
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-boolean-value': 'error'
      },
      settings: {
        react: { version: 'detect' }
      }
    },
    // Rules for TypeScript files
    {
      files: '**/*.{ts,tsx,cts,mts}',
      extends: [
        // TODO: fix errors
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parserOptions: {
        project: ['tsconfig.json']
      },
      rules: {
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error'
      }
    },
    // Core
    {
      ...TAILWIND_CONFIG,
      files: '**',
      plugins: ['typescript-sort-keys'],
      settings: {
        tailwindcss: {
          config: 'tailwind.config.ts',
          callees: ['cn']
        }
      },
      rules: {
        ...TAILWIND_CONFIG.rules
      }
    },
    {
      files: [
        'prettier.config.js',
        'postcss.config.js',
        'vite.config.mjs',
        '.eslintrc.cjs'
      ],
      env: {
        node: true
      }
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-var': 'off'
      }
    }
  ]
}

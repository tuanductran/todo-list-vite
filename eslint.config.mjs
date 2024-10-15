import antfu from '@antfu/eslint-config'
import command from 'eslint-plugin-command/config'

export default antfu(
  {
    formatters: true,
    react: true,
    typescript: true,
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    rules: {
      'command/command': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/order': [
        'warn',
        {
          'alphabetize': {
            caseInsensitive: true,
            order: 'asc',
          },
          'groups': [
            'object',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'jsonc/sort-keys': 'error',
      'logical-assignment-operators': [
        'error',
        'always',
        { enforceForIfStatements: true },
      ],
      'no-dupe-keys': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'no-negated-condition': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'object-shorthand': ['error', 'always'],
      'perfectionist/sort-imports': 'off',
      'prefer-destructuring': [
        'error',
        { VariableDeclarator: { object: true } },
      ],
      'prefer-object-has-own': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'react-dom/no-dangerously-set-innerhtml': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'off',
      'react/no-array-index-key': 'error',
      'react/no-duplicate-key': 'error',
      'sort-keys': ['error', 'asc'],
      'sort-vars': 'error',
      'style/comma-dangle': 'error',
      'style/indent-binary-ops': 'error',
      'style/jsx-curly-newline': 'error',
      'style/jsx-function-call-newline': 'error',
      'style/max-statements-per-line': 'error',
      'style/quotes': 'error',
      'style/type-generic-spacing': 'error',
      'style/type-named-tuple-spacing': 'error',
      'ts/ban-ts-comment': 'off',
      'ts/consistent-type-imports': 'error',
      'ts/no-explicit-any': 'off',
      'ts/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      'ts/no-non-null-assertion': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unused-vars': 'error',
      'ts/no-var-requires': 'off',
      'ts/prefer-for-of': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-negated-condition': 'error',
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          message:
            '`useMemo` with an empty dependency array can\'t provide a stable reference, use `useRef` instead.',
          selector:
            'CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]',
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-alert': 'off',
      'ts/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-var': 'off',
    },
  },
  command(),
)

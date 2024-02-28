/** @type {import("prettier").Config} */
export default {
  printWidth: 80,
  trailingComma: 'es5',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  experimentalTernaries: true,
  parser: 'typescript',
  overrides: [
    {
      files: ['tsconfig*.json', '.vscode/*.json'],
      options: {
        parser: 'json5',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
  ],
};

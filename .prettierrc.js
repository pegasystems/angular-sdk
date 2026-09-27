module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 150,
  trailingComma: 'none',
  arrowParens: 'avoid',
  overrides: [
    {
      files: ['*.html'],
      excludeFiles: ['**/test/**', 'src/app/_components/custom-constellation/**'],
      options: { parser: 'angular' }
    }
  ]
};

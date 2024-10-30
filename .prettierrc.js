module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-organize-attributes'],
  singleQuote: true,
  bracketSpacing: false,
  importOrder: [
    '^@angular/(.*)$',
    '^@angular/cdk',
    '^rxjs',
    '<THIRD_PARTY_MODULES>',
    '^@home-shared/(.*)',
    '^@outside-shared/(.*)',
    '^@shared',
    '^@shared/(.*)',
    '^[./]',
  ],
  printWidth: 140,
  overrides: [
    {
      files: ['*.component.html'],
      options: {
        parser: 'angular',
      },
    },
    {
      files: ['*.html'],
      options: {
        parser: 'html',
      },
    },
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};

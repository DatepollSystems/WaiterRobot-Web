declare const require: any;

export const environment = {
  version: require('../../package.json').version,
  production: true,
  type: 'testing',
  apiUrl: 'http://localhost:8080/api/v1',
  logoUrl: '/assets/logo.svg',
};

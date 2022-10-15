declare const require: any;

export const environment = {
  version: require('../../package.json').version,
  production: true,
  type: 'prod',
  apiUrl: 'https://my.kellner.team/api/v1',
};

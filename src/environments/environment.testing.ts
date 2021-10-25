declare const require: any;

export const environment = {
  version: require('../../package.json').version,
  production: true,
  type: 'testing',
  apiUrl: 'https://lava.kellner.team/api',
};

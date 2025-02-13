import {Environment} from './IEnvironment';

declare const require: any;

export const environment: Environment = {
  version: require('../../package.json').version as string,
  production: true,
  type: 'prod',
  titleSuffix: 'my.kellner.team',
  apiUrl: 'https://my.kellner.team/api',
  logoUrl: '/assets/logo-prod.svg',
};

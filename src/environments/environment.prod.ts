/* eslint-disable @typescript-eslint/no-explicit-any */
import {Environment} from './IEnvironment';

declare const require: any;

export const environment: Environment = {
  version: require('../../package.json').version as string,
  production: true,
  type: 'prod',
  apiUrl: 'https://my.kellner.team/api/v1',
  logoUrl: '/assets/logo-prod.svg',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import {Environment} from './IEnvironment';

declare const require: any;

export const environment: Environment = {
  version: `${require('../../package.json').version}_local`,
  production: false,
  type: 'dev',
  apiUrl: 'http://localhost/api/v1',
  titleSuffix: 'local.kellner.team',
};

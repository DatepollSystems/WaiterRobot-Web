/* eslint-disable @typescript-eslint/no-explicit-any */
import {Environment} from './IEnvironment';

declare const require: any;

export const environment: Environment = {
  version: `${require('../../package.json').version}_lava`,
  production: true,
  type: 'testing',
  apiUrl: 'https://lava.kellner.team/api/v1',
  titleSuffix: 'lava.kellner.team',
};

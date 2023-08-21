/* eslint-disable @typescript-eslint/no-explicit-any */
declare const require: any;

export const environment: {
  version: string;
  production: boolean;
  type: 'dev' | 'testing' | 'prod';
  apiUrl: string;
  logoUrl?: string;
  titlePrefix?: string;
} = {
  version: require('../../package.json').version as string,
  production: true,
  type: 'testing',
  apiUrl: 'http://localhost:8080/api/v1',
  titlePrefix: 'local.kellner.team',
};

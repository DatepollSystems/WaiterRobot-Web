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
  type: 'prod',
  apiUrl: 'https://my.kellner.team/api/v1',
  logoUrl: '/assets/logo-prod.svg',
};

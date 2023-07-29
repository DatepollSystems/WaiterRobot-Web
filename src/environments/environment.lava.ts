declare const require: any;

export const environment: {
  version: string;
  production: boolean;
  type: 'dev' | 'testing' | 'prod';
  apiUrl: string;
  logoUrl?: string;
  titlePrefix?: string;
} = {
  version: require('../../package.json').version,
  production: true,
  type: 'testing',
  apiUrl: 'https://lava.kellner.team/api/v1',
  titlePrefix: 'lava.kellner.team',
};

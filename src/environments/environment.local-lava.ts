declare const require: any;

export const environment: {
  version: string;
  production: boolean;
  type: 'dev' | 'testing' | 'prod';
  apiUrl: string;
  logoUrl?: string;
  titlePrefix?: string;
} = {
  version: `${require('../../package.json').version}-DEV-${getTime()}`,
  production: false,
  type: 'dev',
  apiUrl: 'http://localhost:4300/api/v1',
  titlePrefix: 'lava.kellner.team',
};

function getTime(): string {
  const currentDate = new Date(new Date().toLocaleString('en-US', {timeZone: 'Europe/Vienna'}));
  return (
    `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}` +
    `${String(currentDate.getDate()).padStart(2, '0')}${String(currentDate.getHours()).padStart(2, '0')}` +
    `${String(currentDate.getMinutes()).padStart(2, '0')}${String(currentDate.getSeconds()).padStart(2, '0')}`
  );
}

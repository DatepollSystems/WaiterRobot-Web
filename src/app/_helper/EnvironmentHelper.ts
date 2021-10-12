import {environment} from '../../environments/environment';

export class EnvironmentHelper {
  public static getAPIUrl(): string {
    return environment.apiUrl;
  }

  public static getWebversion(): string {
    return environment.version;
  }

  public static getProduction(): boolean {
    return environment.production;
  }

  public static getType(): string {
    return environment.type;
  }
}

import {environment} from '../../environments/environment';

export class EnvironmentHelper {
  public static get() {
    return environment;
  }

  public static getAPIUrl(): string {
    return environment.apiUrl;
  }

  public static getWebVersion(): string {
    return environment.version;
  }

  public static getProduction(): boolean {
    return environment.production;
  }

  public static getType(): string {
    return environment.type;
  }

  public static getLogoUrl(): string {
    return environment.logoUrl ?? '/assets/logo.svg';
  }

  public static getTitleSuffix(): string {
    return environment.titleSuffix;
  }
}

import {environment} from '../../environments/environment';

export class EnvironmentHelper {
  public static getAPIUrl(): string {
    return environment.apiUrl;
  }
}

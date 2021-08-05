import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {NotificationService} from './notifications/notification.service';
import {EnvironmentHelper} from '../_helper/EnvironmentHelper';
import {AHttpService} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class HttpService extends AHttpService {
  protected apiUrl = EnvironmentHelper.getAPIUrl();
  protected version = '/v1';

  constructor(
    http: HttpClient,
    private notificationService: NotificationService
  ) {
    super(http);
  }

  protected _clientSideError(): void {
    this.notificationService.terror('REQUEST_ERROR_CLIENT');
  }

  protected _serverSideError(): void {
    this.notificationService.terror('REQUEST_ERROR_SERVER');
  }

  public override post(url: string, body: any, functionUser: string|undefined = undefined): any {
    this.log('POST', url, functionUser);

    // TODO: Change back to post; currently get because of json server
    return this.get(url, functionUser);
  }

  public override put(url: string, body: any, functionUser: string|undefined = undefined): any {
    this.log('PUT', url, functionUser);

    // TODO: Change back to post; currently get because of json server
    return this.get(url, functionUser);
  }

  public override delete(url: string, functionUser: string|undefined = undefined): any {
    this.log('DELETE', url, functionUser);

    return this.get(url, functionUser);
  }
}

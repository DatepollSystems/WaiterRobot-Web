import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {NotificationService} from './notifications/notification.service';
import {AuthService} from './auth/auth.service';
import {EnvironmentHelper} from '../_helper/EnvironmentHelper';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = EnvironmentHelper.getAPIUrl();
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  private error(error: any): any {
    if (error.error instanceof ErrorEvent) {
      // Client Side Error
      console.log('Client side error');
      this.notificationService.terror('REQUEST_ERROR_CLIENT');
      return throwError(error.error.message);
    } else {  // Server Side Error
      this.notificationService.terror('REQUEST_ERROR_SERVER');
      console.log('Server side error');
      return throwError(error.error.message);
    }
  }

  public loggedInV1GETRequest(url: string, functionUser: string|null = null): any {
    this.log('GET', url, functionUser);

    return this.http.get(this.apiUrl + '/v1' + url).pipe(
      catchError((error: any) => {
        return this.error(error);
      })
    );
  }

  public loggedInV1POSTRequest(url: string, body: any, functionUser: string|null = null): any {
    this.log('POST', url, functionUser);

    // TODO: Change back to post; currently get because of json server
    return this.loggedInV1GETRequest(url, functionUser);

    // return this.http.post(this.apiUrl + '/v1' + url, body, {headers: this.headers}).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     return this.error(error);
    //   })
    // );
  }

  public loggedInV1PUTRequest(url: string, body: any, functionUser: string|null = null): any {
    this.log('PUT', url, functionUser);

    // TODO: Change back to post; currently get because of json server
    return this.loggedInV1GETRequest(url, functionUser);

    // return this.http.put(this.apiUrl + '/v1' + url, body, {headers: this.headers}).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     return this.error(error);
    //   })
    // );
  }

  public loggedInV1DELETERequest(url: string, functionUser: string|null = null): any {
    this.log('DELETE', url, functionUser);

    return this.http.delete(this.apiUrl + '/v1' + url).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.error(error);
      })
    );
  }

  private log(type: string, url: string, functionUser: string|null = null): void {
    if (functionUser != null) {
      console.log('httpService | ' + type + ' Request | URL: ' + url + ' | Function user: ' + functionUser);
    } else {
      console.log('httpService | ' + type + ' Request | URL: ' + url);
    }
  }
}

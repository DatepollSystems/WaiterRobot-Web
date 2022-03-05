import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {BrowserHelper, Converter, StorageHelper} from 'dfx-helper';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static signInUrl = '/auth/signin';
  public static refreshUrl = '/auth/refresh';

  private sessionToken: string | undefined = undefined;
  private jwtToken: string | undefined = undefined;
  private jwtTokenExpires: Date;

  public redirectUrl: string | undefined = undefined;

  constructor(private httpService: HttpService, private router: Router) {
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  static getSessionInformation(): string {
    const browser = BrowserHelper.infos();
    return (
      browser.name +
      ' - ' +
      Converter.toString(browser.majorVersion) +
      '; OS: ' +
      browser.os +
      '; Phone: ' +
      Converter.toString(browser.mobile)
    );
  }

  public sendSignInRequest(email: string, password: string): Observable<any> {
    const signInObject = {
      email,
      password,
      session_information: AuthService.getSessionInformation(),
      stay_logged_in: true,
    };

    return this.httpService.post(AuthService.signInUrl, signInObject, undefined, 'sendSignInRequest');
  }

  public setSessionToken(sessionToken: string | undefined): void {
    StorageHelper.set('sessionToken', sessionToken);
    this.sessionToken = sessionToken;
  }

  getSessionToken(): string | undefined {
    if (this.sessionToken == null) {
      this.sessionToken = StorageHelper.getString('sessionToken');
    }
    return this.sessionToken;
  }

  public setJWTToken(jwtToken: string | undefined): void {
    StorageHelper.set('token', jwtToken);
    this.jwtToken = jwtToken;
    if (jwtToken != undefined) {
      this.jwtTokenExpires = new Date();
      this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
    }
  }

  public getJWTToken(): string | undefined {
    if (this.jwtToken == null) {
      this.jwtToken = StorageHelper.getString('token');
    }
    return this.jwtToken;
  }

  public refreshJWTToken(): Observable<any> {
    const object = {
      session_token: this.getSessionToken(),
      session_information: AuthService.getSessionInformation(),
    };

    return this.httpService.post(AuthService.refreshUrl, object, undefined, 'refreshJWTToken').pipe(
      tap((data: any) => {
        this.setJWTToken(data.token);
      })
    );
  }

  public logout(): void {
    const object = {
      session_token: this.getSessionToken(),
    };

    this.httpService.post('/auth/logout', object).subscribe(
      () => {
        this.clearStorage();
        void this.router.navigateByUrl('/about');
      },
      () => {
        this.clearStorage();
        void this.router.navigateByUrl('/about');
      }
    );
  }

  public clearStorage(): void {
    this.setSessionToken(undefined);
    this.setJWTToken(undefined);
    StorageHelper.removeAll();
  }

  public isAuthenticated(): boolean {
    return this.getSessionToken() != undefined;
  }

  public isJWTTokenValid(): boolean {
    if (this.getJWTToken() == undefined) {
      return false;
    }

    return new Date().getTime() < this.jwtTokenExpires.getTime();
  }
}

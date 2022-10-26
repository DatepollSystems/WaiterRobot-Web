import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BrowserHelper, Converter, StorageHelper} from 'dfx-helper';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {JWTResponse, RefreshJWTWithSessionTokenDto, SignInWithPasswordChangeDto, UserSignInDto} from '../../waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static signInUrl = '/auth/signIn';
  public static signInPwChangeUrl = '/auth/signInPwChange';
  public static refreshUrl = '/auth/refresh';

  private sessionToken?: string;
  private jwtToken?: string;
  private jwtTokenExpires: Date;

  constructor(private httpClient: HttpClient) {
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

  public sendSignInRequest = (email: string, password: string) =>
    this.httpClient.post<JWTResponse>(AuthService.signInUrl, {
      email,
      password,
      sessionInformation: AuthService.getSessionInformation(),
      stayLoggedIn: true,
    } as UserSignInDto);

  public sendSignInWithPasswordChangeRequest = (email: string, oldPassword: string, newPassword: string) =>
    this.httpClient.post<JWTResponse>(AuthService.signInPwChangeUrl, {
      email,
      oldPassword,
      newPassword,
      sessionInformation: AuthService.getSessionInformation(),
      stayLoggedIn: true,
    } as SignInWithPasswordChangeDto);

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
      sessionToken: this.getSessionToken(),
      sessionInformation: AuthService.getSessionInformation(),
    } as RefreshJWTWithSessionTokenDto;

    return this.httpClient.post(AuthService.refreshUrl, object).pipe(
      tap((response: JWTResponse) => {
        this.setJWTToken(response.token);
      })
    );
  }

  public logout(): void {
    this.httpClient
      .post('/auth/logout', {
        session_token: this.getSessionToken(),
      })
      .subscribe({
        next: () => {
          this.clearStorage();
          window.location.reload();
        },
        error: () => {
          this.clearStorage();
          window.location.reload();
        },
      });
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

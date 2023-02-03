import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {i_complete, s_from, s_fromStorage, st_removeAll, st_set} from 'dfts-helper';
import {WINDOW} from 'dfx-helper';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {JWTResponse, RefreshJWTWithSessionTokenDto, SignInWithPasswordChangeDto, UserSignInDto} from '../../waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static signInUrl = '/auth/login';
  public static signInPwChangeUrl = '/auth/signInPwChange';
  public static refreshUrl = '/auth/refresh';

  private sessionToken?: string;
  private jwtToken?: string;
  private jwtTokenExpires: Date;

  constructor(private httpClient: HttpClient, @Inject(WINDOW) private window: Window) {
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  static getSessionInformation(): string {
    const browser = i_complete();
    return browser.name + ' - ' + s_from(browser.majorVersion) + '; OS: ' + browser.os + '; Phone: ' + s_from(browser.mobile);
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
    st_set('sessionToken', sessionToken);
    this.sessionToken = sessionToken;
  }

  getSessionToken(): string | undefined {
    if (this.sessionToken == null) {
      this.sessionToken = s_fromStorage('sessionToken');
    }
    return this.sessionToken;
  }

  public setJWTToken(jwtToken: string | undefined): void {
    st_set('token', jwtToken);
    this.jwtToken = jwtToken;
    if (jwtToken != undefined) {
      this.jwtTokenExpires = new Date();
      this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
    }
  }

  public getJWTToken(): string | undefined {
    if (this.jwtToken == null) {
      this.jwtToken = s_fromStorage('token');
    }
    return this.jwtToken;
  }

  public refreshJWTToken(): Observable<any> {
    const object = {
      refreshToken: this.getSessionToken(),
      sessionInformation: AuthService.getSessionInformation(),
    } as RefreshJWTWithSessionTokenDto;

    return this.httpClient.post<JWTResponse>(AuthService.refreshUrl, object).pipe(
      tap((response) => {
        this.setJWTToken(response.accessToken);
        this.setSessionToken(response.refreshToken);
      })
    );
  }

  public logout(): void {
    this.httpClient
      .post('/auth/logout', {
        refreshToken: this.getSessionToken(),
      })
      .subscribe({
        next: () => {
          this.clearStorage();
          this.window.location.reload();
        },
        error: () => {
          this.clearStorage();
          this.window.location.reload();
        },
      });
  }

  public clearStorage(): void {
    this.setSessionToken(undefined);
    this.setJWTToken(undefined);
    st_removeAll();
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

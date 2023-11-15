import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';

import {BehaviorSubject, catchError, EMPTY, map, merge, Observable, of, Subject, switchMap, tap} from 'rxjs';

import {connect} from 'ngxtension/connect';

import {i_complete, s_from, s_fromStorage, st_removeAll, st_set} from 'dfts-helper';
import {injectWindow} from 'dfx-helper';

import {NotificationService} from '../../notifications/notification.service';
import {JwtResponse, RefreshJwtWithSessionTokenDto, SignInWithPasswordChangeDto, UserLoginDto} from '../../waiterrobot-backend';

type AuthState = {
  status: 'LOGGED_OUT' | 'ERROR' | 'LOADING' | 'LOGGED_IN';
  loginError?: 'ACCOUNT_NOT_ACTIVATED' | 'PASSWORD_CHANGE_REQUIRED';
  accessToken?: string;
  refreshToken?: string;
  redirectUrl?: string;
};

export const loginUrl = '/auth/login';
export const loginPwChangeUrl = '/auth/passwordChange';
export const requestPasswordChangeUrl = '/auth/resetPassword';
export const sendPasswordChangeUrl = '/auth/resetPassword/update';
export const refreshUrl = '/auth/refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private window = injectWindow();

  static getSessionInformation(): string {
    const browser = i_complete();
    return browser.name + ' - ' + s_from(browser.majorVersion) + '; OS: ' + browser.os + '; Phone: ' + s_from(browser.mobile);
  }

  public triggerLogin = new Subject<{email: string; password: string}>();
  public triggerLoginWithPwChange = new Subject<{email: string; oldPassword: string; newPassword: string}>();

  private triggerLogout = new Subject<string | undefined>();

  private authState = signal<AuthState>({status: 'LOGGED_OUT'});

  private refreshTokenLoad = new BehaviorSubject(s_fromStorage('refreshToken'));
  private accessTokenLoad = new BehaviorSubject(s_fromStorage('accessToken'));
  private triggerLoginError = new Subject<AuthState['loginError']>();

  private login$ = this.triggerLogin.pipe(
    switchMap(({email, password}) =>
      this.httpClient.post<JwtResponse>(loginUrl, {
        email,
        password,
        sessionInformation: AuthService.getSessionInformation(),
        stayLoggedIn: true,
      } as UserLoginDto),
    ),
    catchError((error) => {
      const codeName = error?.error?.codeName as unknown;
      if (codeName === 'ACCOUNT_NOT_ACTIVATED' || codeName === 'PASSWORD_CHANGE_REQUIRED') {
        this.triggerLoginError.next(codeName);
        return EMPTY;
      }

      this.notificationService.terror('ABOUT_SIGNIN_FAILED');

      return EMPTY;
    }),
    map(({accessToken, refreshToken}) => ({accessToken, refreshToken, status: 'LOGGED_IN' as const})),
  );

  private loginWithPwChange$ = this.triggerLoginWithPwChange.pipe(
    switchMap(({email, newPassword, oldPassword}) =>
      this.httpClient.post<JwtResponse>(loginPwChangeUrl, {
        email,
        oldPassword,
        newPassword,
        sessionInformation: AuthService.getSessionInformation(),
        stayLoggedIn: true,
      } as SignInWithPasswordChangeDto),
    ),
    map(({accessToken, refreshToken}) => ({accessToken, refreshToken, status: 'LOGGED_IN' as const})),
    catchError(() => {
      this.notificationService.terror('ABOUT_SIGNIN_FAILED');
      return of({status: 'ERROR' as const});
    }),
  );

  private logout$ = this.triggerLogout.pipe(
    switchMap(() => this.httpClient.post('/auth/logout', {refreshToken: this.refreshToken()})),
    tap(() => {
      this.clearStorage();
      this.window?.location.reload();
    }),
    catchError(() => {
      this.clearStorage();
      this.window?.location.reload();
      return of({status: 'LOGGED_OUT' as const});
    }),
    map(() => ({status: 'LOGGED_OUT' as const})),
  );

  constructor() {
    connect(
      this.authState,
      merge(
        this.triggerLogin.pipe(map(() => ({status: 'LOADING' as const, loginError: undefined}))),
        this.triggerLoginWithPwChange.pipe(map(() => ({status: 'LOADING' as const, loginError: undefined}))),
        this.login$,
        this.loginWithPwChange$,
        this.logout$,
        this.triggerLoginError.pipe(map((loginError) => ({loginError, status: 'ERROR' as const}))),
        this.refreshTokenLoad.pipe(
          map((refreshToken) => ({refreshToken, status: refreshToken ? ('LOGGED_IN' as const) : ('LOGGED_OUT' as const)})),
        ),
        this.accessTokenLoad.pipe(map((accessToken) => ({accessToken}))),
      ),
    );
  }

  sendPasswordResetRequest = (email: string): Observable<unknown> => this.httpClient.post(requestPasswordChangeUrl, {email: email});

  sendPasswordReset = (email: string, resetToken: string, newPassword: string): Observable<unknown> =>
    this.httpClient.post(sendPasswordChangeUrl, {email, resetToken, newPassword});

  setRefreshToken(refreshToken: string | undefined): void {
    st_set('refreshToken', refreshToken);
    this.refreshTokenLoad.next(refreshToken);
  }

  setJWTToken(accessToken: string | undefined): void {
    st_set('accessToken', accessToken);
    this.accessTokenLoad.next(accessToken);
  }

  setRedirectUrl(redirectUrl: string): void {
    this.authState.update((it) => ({...it, redirectUrl}));
  }

  refreshToken = computed(() => this.authState().refreshToken);
  accessToken = computed(() => this.authState().accessToken);
  status = computed(() => this.authState().status);
  loginError = computed(() => this.authState().loginError);
  redirectUrl = computed(() => this.authState().redirectUrl);

  refreshAccessToken(): Observable<JwtResponse> {
    return this.httpClient
      .post<JwtResponse>(refreshUrl, {
        refreshToken: this.refreshToken(),
        sessionInformation: AuthService.getSessionInformation(),
      } as RefreshJwtWithSessionTokenDto)
      .pipe(
        tap((response) => {
          this.setJWTToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
        }),
      );
  }

  logout(): void {
    this.triggerLogout.next(this.refreshToken());
  }

  clearStorage(): void {
    this.setRefreshToken(undefined);
    this.setJWTToken(undefined);
    st_removeAll();
  }

  isAuthenticated(): boolean {
    return this.status() === 'LOGGED_IN';
  }
}

import {Injectable, computed, inject, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {BehaviorSubject, Subject, catchError, map, merge, of, switchMap, tap} from 'rxjs';

import {i_complete, s_from, s_fromStorage, st_removeAll, st_set} from 'dfts-helper';
import {injectWindow} from 'dfx-helper';
import {connect} from 'ngxtension/connect';
import {filterNil} from 'ngxtension/filter-nil';

import {injectAPI} from '../../api';
import {NotificationService} from '../notification.service';

interface AuthState {
  status: 'LOGGED_OUT' | 'ERROR' | 'LOADING' | 'LOGGED_IN';
  loginError?: 'ACCOUNT_NOT_ACTIVATED' | 'PASSWORD_CHANGE_REQUIRED';
  accessToken?: string;
  refreshToken?: string;
  redirectUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = injectAPI();
  private notificationService = inject(NotificationService);
  private window = injectWindow();

  static getSessionInformation(): string {
    const browser = i_complete();
    return browser.name + ' - ' + s_from(browser.majorVersion) + '; OS: ' + browser.os + '; Phone: ' + s_from(browser.mobile);
  }

  public triggerLogin = new Subject<{email: string; password: string}>();
  public triggerLoginWithPwChange = new Subject<{
    email: string;
    oldPassword: string;
    newPassword: string;
  }>();

  private triggerLogout = new Subject<string | undefined>();

  private authState = signal<AuthState>({status: 'LOGGED_OUT'});

  private refreshTokenLoad = new BehaviorSubject(s_fromStorage('refreshToken'));
  private accessTokenLoad = new BehaviorSubject(s_fromStorage('accessToken'));
  private triggerLoginError = new Subject<AuthState['loginError']>();

  private login$ = this.triggerLogin.pipe(
    switchMap(({email, password}) =>
      this.api
        .post('/v1/auth/login', {
          body: {
            email,
            password,
            sessionInformation: AuthService.getSessionInformation(),
            stayLoggedIn: true,
          },
        })
        .pipe(
          catchError((error) => {
            const codeName = error?.error?.codeName as unknown;
            if (codeName === 'ACCOUNT_NOT_ACTIVATED' || codeName === 'PASSWORD_CHANGE_REQUIRED') {
              this.triggerLoginError.next(codeName);
              return of(undefined);
            }

            this.notificationService.terror('ABOUT_SIGNIN_FAILED');

            return of(undefined);
          }),
        ),
    ),
    filterNil(),
    map(({accessToken, refreshToken}) => ({
      accessToken,
      refreshToken,
      status: 'LOGGED_IN' as const,
    })),
    tap((it) => {
      st_set('refreshToken', it.refreshToken);
      st_set('accessToken', it.accessToken);
    }),
  );

  private loginWithPwChange$ = this.triggerLoginWithPwChange.pipe(
    switchMap(({email, newPassword, oldPassword}) =>
      this.api
        .post('/v1/auth/passwordChange', {
          body: {
            email,
            oldPassword,
            newPassword,
            password: oldPassword, // TODO: fix backend dto issue
            sessionInformation: AuthService.getSessionInformation(),
            stayLoggedIn: true,
          },
        })
        .pipe(
          catchError(() => {
            this.notificationService.terror('ABOUT_SIGNIN_FAILED');
            return of(undefined);
          }),
        ),
    ),
    filterNil(),
    map(({accessToken, refreshToken}) => ({
      accessToken,
      refreshToken,
      status: 'LOGGED_IN' as const,
    })),
    tap((it) => {
      st_set('refreshToken', it.refreshToken);
      st_set('accessToken', it.accessToken);
    }),
  );

  private logout$ = this.triggerLogout.pipe(
    switchMap(() =>
      this.api
        .post('/v1/auth/logout', {
          body: {
            refreshToken: this.refreshToken() ?? 'INVALID_TOKEN',
          },
        })
        .pipe(
          catchError(() => {
            this.clearStorage();
            this.window?.location.reload();
            return of({status: 'LOGGED_OUT' as const});
          }),
        ),
    ),
    tap(() => {
      this.clearStorage();
      this.window?.location.reload();
    }),
    map(() => ({status: 'LOGGED_OUT' as const})),
  );

  refreshToken = computed(() => this.authState().refreshToken);
  accessToken = computed(() => this.authState().accessToken);
  status = computed(() => this.authState().status);
  status$ = toObservable(this.status);
  loginError = computed(() => this.authState().loginError);
  redirectUrl = computed(() => this.authState().redirectUrl);

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
          map((refreshToken) => ({
            refreshToken,
            status: refreshToken ? ('LOGGED_IN' as const) : ('LOGGED_OUT' as const),
          })),
        ),
        this.accessTokenLoad.pipe(map((accessToken) => ({accessToken}))),
      ),
    );
  }

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

  refreshAccessToken() {
    return this.api
      .post('/v1/auth/refresh', {
        body: {
          refreshToken: this.refreshToken()!!,
          sessionInformation: AuthService.getSessionInformation(),
        },
      })
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

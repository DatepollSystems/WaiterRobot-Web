import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {loggerOf} from 'dfts-helper';

import {WINDOW} from 'dfx-helper';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {NotificationService} from '../../../notifications/notification.service';

import {EnvironmentHelper} from '../../EnvironmentHelper';

import {JWTResponse} from '../../waiterrobot-backend';
import {AuthService} from './auth.service';

/**
 * Don't intercept this requests
 */
const paths = [AuthService.signInUrl, AuthService.signInPwChangeUrl, AuthService.refreshUrl, 'assets/i18n'];

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const window = inject(WINDOW);
  const lumber = loggerOf('authInterceptor');

  let toIntercept = true;
  for (const path of paths) {
    if (req.url.includes(path)) {
      toIntercept = false;
      break;
    }
  }

  if (!toIntercept) {
    return next(req);
  } else {
    if (authService.isJWTTokenValid()) {
      req = addToken(req, authService.getJWTToken());
    }

    return next(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              /* When a session token was cancelled and the user decides to log out he gets an error and can't log out. This checks the url,
               * clears the cookies and reloads the site. If the Angular app now checks isAuthenticated in the auth guard the
               * app will route to sign in.
               */
              if (req.url.includes('/logout')) {
                authService.clearStorage();

                window?.location.reload();
              }

              if (!isRefreshing) {
                isRefreshing = true;
                refreshTokenSubject.next(undefined);

                return authService.refreshJWTToken().pipe(
                  switchMap((data: JWTResponse) => {
                    lumber.info('handle401Error', 'JWT token refreshed');
                    isRefreshing = false;
                    refreshTokenSubject.next(data.accessToken);
                    return next(addToken(req, data.accessToken));
                  }),
                  catchError(() => {
                    lumber.error('handle401Error', 'Could not refresh jwt token with session token');
                    if (EnvironmentHelper.getType() === 'prod') {
                      authService.clearStorage();
                      window?.location.reload();
                    } else {
                      notificationService.warning(
                        'Something did not work out during the session refresh! Normally you would have been logged out and the window would have been force complete refreshed but for debugging purposes nothing happened!',
                        25 * 1000
                      );
                    }

                    return next(req);
                  })
                );
              } else {
                return refreshTokenSubject.pipe(
                  filter((token) => token != undefined),
                  take(1),
                  switchMap((jwt: string) => {
                    lumber.info('handle401Error', 'Already refreshing; JWT: "' + jwt + '"');
                    return next(addToken(req, jwt));
                  })
                ) as Observable<HttpEvent<any>>;
              }
            default:
              return throwError(error.error.message);
          }
        } else if (error.error instanceof ErrorEvent) {
          // Client Side Error
          lumber.error('intercept', 'Client side error');
          return throwError(error.error.message);
        } else {
          // Server Side Error
          lumber.error('intercept', 'Server side error');
          return throwError(error.error.message);
        }
      })
    );
  }
}

const addToken = (req: HttpRequest<any>, token?: string): HttpRequest<any> =>
  req.clone({
    setHeaders: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

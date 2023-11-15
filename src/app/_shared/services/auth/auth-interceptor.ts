import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';

import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';

import {loggerOf} from 'dfts-helper';
import {injectWindow} from 'dfx-helper';

import {EnvironmentHelper} from '../../EnvironmentHelper';
import {NotificationService} from '../../notifications/notification.service';
import {JwtResponse} from '../../waiterrobot-backend';
import {AuthService, loginPwChangeUrl, loginUrl, refreshUrl} from './auth.service';

/**
 * Don't intercept this requests
 */
const paths = [loginUrl, loginPwChangeUrl, refreshUrl, 'assets/i18n'];

let isRefreshing = false;
const nextAccessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const window = injectWindow();
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
    req = addToken(req, authService.accessToken());

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
                nextAccessTokenSubject.next(undefined);

                return authService.refreshAccessToken().pipe(
                  switchMap((data: JwtResponse) => {
                    lumber.info('handle401Error', 'JWT token refreshed');
                    isRefreshing = false;
                    nextAccessTokenSubject.next(data.accessToken);
                    return next(addToken(req, data.accessToken));
                  }),
                  catchError(() => {
                    lumber.error('handle401Error', 'Could not refresh access token with refresh token');
                    if (EnvironmentHelper.getType() === 'prod') {
                      authService.clearStorage();
                      window?.location.reload();
                    } else {
                      notificationService.error(
                        'Something did not work out during the session refresh! On prod you would have been logged out and the window would have been force refreshed but on lava and dev nothing happens!',
                        25 * 1000,
                      );
                    }

                    return next(req);
                  }),
                );
              } else {
                return nextAccessTokenSubject.pipe(
                  filter((token) => token != undefined),
                  take(1),
                  switchMap((jwt: string | undefined) => {
                    lumber.info('handle401Error', 'Already refreshing; JWT: "' + jwt + '"');
                    return next(addToken(req, jwt));
                  }),
                );
              }
            default:
              return throwError(() => error.error.message as string);
          }
        } else if (error.error instanceof ErrorEvent) {
          // Client Side Error
          lumber.error('intercept', 'Client side error');
          return throwError(() => error.error.message as string);
        } else {
          // Server Side Error
          lumber.error('intercept', 'Server side error');
          return throwError(() => error.error.message as string);
        }
      }),
    );
  }
}

const addToken = (req: HttpRequest<unknown>, token?: string): HttpRequest<unknown> =>
  req.clone({
    setHeaders: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Don't intercept this requests
   * "assets/i18n" - Language files for DatePoll frontend
   * "/auth" - Auth routes for login, change password, etc.
   */
  private paths = ['/auth/login', '/auth/IamLoggedIn', 'assets/i18n'];

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private addToken(req: HttpRequest<any>, token: string | undefined): HttpRequest<any> {
    if (!token) {
      token = '';
    }
    return req.clone({
      setHeaders: {
        'content-type': 'application/json',
        AUTHORIZATION: `${token}`,
      },
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let toIntercept = true;
    for (const path of this.paths) {
      if (req.url.includes(path)) {
        toIntercept = false;
        break;
      }
    }

    if (!toIntercept) {
      return next.handle(req);
    } else {
      if (this.authService.isJWTTokenValid()) {
        req = this.addToken(req, this.authService.getJWTToken());
      }

      return next.handle(req).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 401:
                return this.handle401Error(req, next);
              default:
                return throwError(error.message);
            }
          } else if (error.error instanceof ErrorEvent) {
            // Client Side Error
            console.log('Client side error');
            return throwError(error.error.message);
          } else {
            // Server Side Error
            console.log('Server side error');
            return throwError(error.error.message);
          }
        })
      );
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /* When a session token was cancelled and this users decides to logout he gets an error and can't logout. This checks the url,
     * clears the cookies and reloads the site. If the Angular app now checks isAuthenticated in the auth guard the
     * app will route to sign in.
     */
    // if (request.url.includes('/logoutCurrentSession')) {
    //   this.authService.clearStorage();
    //
    //   window.location.reload();
    // }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshJWTToken().pipe(
        switchMap((data: any) => {
          console.log('authInterceptor | Refreshing JWT token...');
          console.log(data);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(data.access_token);
          return next.handle(this.addToken(request, data.access_token));
        }),
        catchError(() => {
          this.authService.clearStorage();
          window.location.reload();

          return next.handle(this.addToken(request, 'null'));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          console.log('authInterceptor | Already refreshing | JWT: ' + jwt);
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}

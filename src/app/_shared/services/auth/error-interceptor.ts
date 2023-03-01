import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {NotificationService} from '../../../notifications/notification.service';
import {AuthService} from './auth.service';

/**
 * Don't intercept this requests
 */
const paths = [AuthService.signInUrl, AuthService.signInPwChangeUrl, AuthService.refreshUrl];

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);

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
    return next(req).pipe(
      catchError((error) => {
        notificationService.terror('REQUEST_ERROR');
        return throwError(() => error);
      })
    );
  }
}

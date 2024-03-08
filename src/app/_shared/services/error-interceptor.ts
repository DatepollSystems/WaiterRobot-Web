import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';

import {catchError, Observable, throwError} from 'rxjs';

import {NotificationService} from '../notifications/notification.service';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: {status: number}) => {
      // Rate limit exceeded
      if (error.status === 429) {
        notificationService.terror('ABOUT_SIGNIN_FAILED_RATE_LIMIT');
      }
      return throwError(() => error);
    }),
  );
}

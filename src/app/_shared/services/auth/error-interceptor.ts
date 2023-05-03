import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {NotificationService} from '../../../notifications/notification.service';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: {status: number}) => {
      if (error?.status !== 401 && error?.status !== 503 && error?.status !== 504) {
        notificationService.terror('REQUEST_ERROR');
      }
      return throwError(() => error);
    })
  );
}

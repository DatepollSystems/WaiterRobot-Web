import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {loggerOf, o_fromStorage, st_set} from 'dfts-helper';
import {catchError, map, merge, Observable, of, shareReplay, Subject, tap, throwError} from 'rxjs';
import {GetMyselfResponse} from '../../../waiterrobot-backend';

import {MyUserModel} from './my-user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  httpClient = inject(HttpClient);
  lumber = loggerOf('MyUserService');

  manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  user$ = merge(
    this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(
      tap((it) => st_set('my_user', it)),
      catchError((error) => {
        const user = o_fromStorage<GetMyselfResponse>('my_user');
        this.lumber.info('getUserRequest', 'Try to read user from storage', user);
        return user ? of(user) : throwError(() => error);
      }),
      map((it) => new MyUserModel(it)),
    ),
    this.manualUserChange.asObservable(),
  ).pipe(shareReplay(1));

  getUser$(): Observable<MyUserModel> {
    return this.user$;
  }
}

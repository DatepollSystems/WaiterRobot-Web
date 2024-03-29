import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {SessionModel} from '@shared/model/session.model';
import {GetWaiterResponse, SessionResponse} from '@shared/waiterrobot-backend';

import {HasDelete, HasGetAll, HasGetByParent} from 'dfx-helper';

import {BehaviorSubject, map, Observable, of, switchMap, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class WaiterSessionsService
  implements HasGetAll<SessionModel>, HasGetByParent<SessionModel, GetWaiterResponse>, HasDelete<SessionModel>
{
  url = '/config/waiter/session';

  triggerGet$ = new BehaviorSubject(true);

  httpClient = inject(HttpClient);

  convert = (it: SessionResponse): SessionModel => new SessionModel(it);

  getByParent$(waiterId: number): Observable<SessionModel[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.httpClient.get<SessionResponse[]>(this.url, {params: {waiterId}}).pipe(map((it) => it.map((iit) => this.convert(iit)))),
      ),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  getAll$(): Observable<SessionModel[]> {
    return of([]);
  }
}

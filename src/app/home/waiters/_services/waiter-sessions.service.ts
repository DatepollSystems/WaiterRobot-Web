import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap} from 'rxjs';
import {HasDelete, HasGetAll, HasGetByParent} from '../../../_shared/services/abstract-entity.service';
import {GetWaiterResponse, SessionResponse} from '../../../_shared/waiterrobot-backend';
import {SessionModel} from '../../../_shared/model/session.model';

@Injectable({providedIn: 'root'})
export class WaiterSessionsService
  implements HasGetAll<SessionModel>, HasGetByParent<SessionModel, GetWaiterResponse>, HasDelete<SessionModel>
{
  url = '/config/waiter/session';

  triggerGet$ = new BehaviorSubject(true);

  httpClient = inject(HttpClient);

  convert = (it: SessionResponse): SessionModel => new SessionModel(it);

  getByParent$(id: number): Observable<SessionModel[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.httpClient
          .get<SessionResponse[]>(this.url, {params: new HttpParams().set('waiterId', id)})
          .pipe(map((it) => it.map((iit) => this.convert(iit))))
      )
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getAll$(): Observable<SessionModel[]> {
    return of([]);
  }
}

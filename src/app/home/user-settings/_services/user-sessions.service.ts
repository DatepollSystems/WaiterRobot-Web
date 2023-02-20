import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {SessionModel} from '../../../_shared/model/session.model';

import {SessionResponse} from '../../../_shared/waiterrobot-backend';
import {HasDelete, HasGetAll} from '../../../_shared/services/abstract-entity.service';
import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserSessionsService implements HasGetAll<SessionModel>, HasDelete<SessionModel> {
  url = '/user/sessions';

  trigger$ = new BehaviorSubject(true);

  httpClient = inject(HttpClient);

  convert = (it: SessionResponse): SessionModel => new SessionModel(it);

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getAll$(): Observable<SessionModel[]> {
    return this.trigger$.pipe(
      switchMap(() => this.httpClient.get<SessionResponse[]>(this.url).pipe(map((it) => it.map((iit) => this.convert(iit)))))
    );
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, map, switchMap} from 'rxjs';

import {HasDelete, HasGetAll} from 'dfx-helper';

import {SessionModel} from '@shared/model/session.model';
import {SessionResponse} from '@shared/waiterrobot-backend';

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
      switchMap(() => this.httpClient.get<SessionResponse[]>(this.url).pipe(map((it) => it.map((iit) => this.convert(iit))))),
    );
  }
}

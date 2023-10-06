import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {DeadLetterResponse} from '../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class DeadLettersService implements HasGetAll<DeadLetterResponse>, HasGetSingle<DeadLetterResponse>, HasDelete<DeadLetterResponse> {
  url = '/config/dead-letter';

  constructor(private httpClient: HttpClient) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<DeadLetterResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<DeadLetterResponse[]>(`${this.url}`)));
  }

  getSingle$(id: number): Observable<DeadLetterResponse> {
    return this.getAll$().pipe(map((letters) => letters.find((it) => it.id === id)!));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}

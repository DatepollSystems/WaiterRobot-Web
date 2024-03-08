import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {CreateUserDto, GetUserResponse, IdResponse, UpdateUserDto} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsersService
  implements
    HasGetAll<GetUserResponse>,
    HasGetSingle<GetUserResponse>,
    HasCreateWithIdResponse<CreateUserDto>,
    HasUpdateWithIdResponse<UpdateUserDto>,
    HasDelete<GetUserResponse>
{
  url = '/config/user';
  #httpClient = inject(HttpClient);

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetUserResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.#httpClient.get<GetUserResponse[]>(this.url)));
  }

  getSingle$(id: number): Observable<GetUserResponse> {
    return this.#httpClient.get<GetUserResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreateUserDto): Observable<IdResponse> {
    return this.#httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdateUserDto): Observable<IdResponse> {
    return this.#httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.#httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}

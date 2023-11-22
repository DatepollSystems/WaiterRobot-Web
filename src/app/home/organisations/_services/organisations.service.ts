import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, catchError, EMPTY, Observable, shareReplay, switchMap, tap} from 'rxjs';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateOrganisationDto,
  GetOrganisationResponse,
  IdResponse,
  UpdateEventOrLocationDto,
  UpdateOrganisationDto,
} from '../../../_shared/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService
  implements
    HasGetAll<GetOrganisationResponse>,
    HasGetSingle<GetOrganisationResponse>,
    HasCreateWithIdResponse<CreateOrganisationDto>,
    HasUpdateWithIdResponse<UpdateOrganisationDto>,
    HasDelete<GetOrganisationResponse>
{
  private url = '/config/organisation';

  private httpClient = inject(HttpClient);

  create$(dto: CreateOrganisationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetOrganisationResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetOrganisationResponse[]>(this.url)),
      shareReplay(1),
      catchError(() => EMPTY),
    );
  }

  getSingle$(id: number): Observable<GetOrganisationResponse> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetOrganisationResponse>(`${this.url}/${id}`)));
  }
}

import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, shareReplay, switchMap, tap} from 'rxjs';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {
  CreateEventOrLocationDto,
  GetEventOrLocationResponse,
  GetProductResponse,
  IdResponse,
  UpdateEventOrLocationDto,
} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSingle} from 'dfx-helper';

import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService
  implements
    HasGetAll<GetEventOrLocationResponse>,
    HasGetSingle<GetEventOrLocationResponse>,
    HasCreateWithIdResponse<CreateEventOrLocationDto>,
    HasUpdateWithIdResponse<UpdateEventOrLocationDto>,
    HasDelete<GetProductResponse>
{
  private url = '/config/event';

  private httpClient = inject(HttpClient);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  create$(dto: CreateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetEventOrLocationResponse[]> {
    return combineLatest([this.triggerGet$, this.selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) => this.httpClient.get<GetEventOrLocationResponse[]>(this.url, {params: {organisationId}})),
      map((it) => it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()))),
      shareReplay(1),
      catchError(() => EMPTY),
    );
  }

  getAllById$(organisationId: number): Observable<GetEventOrLocationResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetEventOrLocationResponse[]>(this.url, {params: {organisationId}})));
  }

  getSingle$(id: number): Observable<GetEventOrLocationResponse> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetEventOrLocationResponse>(`${this.url}/${id}`)));
  }

  clone$(id: number): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(`${this.url}/${id}/clone`, undefined).pipe(tap(() => this.triggerGet$.next(true)));
  }
}

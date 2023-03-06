import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
  CreateEventOrLocationDto,
  GetEventOrLocationResponse,
  GetProductResponse,
  IdResponse,
  UpdateEventOrLocationDto,
} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {
  HasCreateWithIdResponse,
  HasDelete,
  HasGetAll,
  HasGetSelected,
  HasGetSingle,
  HasUpdateWithIdResponse,
  notNullAndUndefined,
} from '../../../_shared/services/abstract-entity.service';
import {BehaviorSubject, combineLatest, filter, map, Observable, of, shareReplay, switchMap} from 'rxjs';
import {tap} from 'rxjs/operators';
import {o_fromStorage, s_from, st_set} from 'dfts-helper';

@Injectable({
  providedIn: 'root',
})
export class EventsService
  implements
    HasGetSelected<GetEventOrLocationResponse>,
    HasGetAll<GetEventOrLocationResponse>,
    HasGetSingle<GetEventOrLocationResponse>,
    HasCreateWithIdResponse<CreateEventOrLocationDto>,
    HasUpdateWithIdResponse<UpdateEventOrLocationDto>,
    HasDelete<GetProductResponse>
{
  private url = '/config/event';
  private selectedStorageKey = 'selected_event';

  constructor(private httpClient: HttpClient, private organisationsService: OrganisationsService) {}

  create$(dto: CreateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  private selectedChange = new BehaviorSubject(o_fromStorage<GetEventOrLocationResponse>(this.selectedStorageKey));

  setSelected(it: GetEventOrLocationResponse): void {
    st_set(this.selectedStorageKey, it);
    this.selectedChange.next(it);
  }

  getSelected$ = combineLatest([this.selectedChange, this.organisationsService.getSelected$]).pipe(
    map(([selected, selectedOrganisation]) => {
      if (selectedOrganisation !== undefined) {
        return selected;
      }
      return undefined;
    }),
    shareReplay(1)
  );

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetEventOrLocationResponse[]> {
    return combineLatest([
      this.triggerGet$,
      this.getSelected$,
      this.organisationsService.getSelected$.pipe(filter(notNullAndUndefined)),
    ]).pipe(
      switchMap(([, selected, organisation]) =>
        combineLatest([
          of(selected),
          this.httpClient.get<GetEventOrLocationResponse[]>(this.url, {
            params: new HttpParams().set('organisationId', organisation.id),
          }),
        ])
      ),
      tap(([selected, entities]) => {
        if (selected && entities.length > 0) {
          for (const entity of entities) {
            if (selected.id === entity.id) {
              this.setSelected(entity);
              break;
            }
          }
        }
      }),
      map(([, request]) => request)
    );
  }

  getSingle$(id: number): Observable<GetEventOrLocationResponse> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetEventOrLocationResponse>(`${this.url}/${id}`)));
  }
}

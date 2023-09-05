import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, shareReplay, switchMap, tap} from 'rxjs';

import {notNullAndUndefined, o_fromStorage, s_from, st_remove, st_set} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSelected, HasGetSingle} from 'dfx-helper';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {
  CreateEventOrLocationDto,
  GetEventOrLocationResponse,
  GetProductResponse,
  IdResponse,
  UpdateEventOrLocationDto,
} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

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

  constructor(
    private httpClient: HttpClient,
    private organisationsService: OrganisationsService,
  ) {}

  create$(dto: CreateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  private selectedChange = new BehaviorSubject(o_fromStorage<GetEventOrLocationResponse>(this.selectedStorageKey));

  setSelected(it: GetEventOrLocationResponse | undefined): void {
    st_set(this.selectedStorageKey, it);
    this.selectedChange.next(it);
  }

  getSelected$ = combineLatest([this.selectedChange, this.organisationsService.getSelected$]).pipe(
    map(([selected, selectedOrganisation]) => {
      if (selectedOrganisation !== undefined && selectedOrganisation.id === selected?.organisationId) {
        return selected;
      }
      st_remove(this.selectedStorageKey);
      return undefined;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetEventOrLocationResponse[]> {
    return combineLatest([this.triggerGet$, this.organisationsService.getSelected$.pipe(filter(notNullAndUndefined))]).pipe(
      switchMap(([, organisation]) =>
        this.httpClient.get<GetEventOrLocationResponse[]>(this.url, {
          params: new HttpParams().set('organisationId', organisation.id),
        }),
      ),
      map((it) => it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()))),
      tap((entities) => {
        const selected = this.selectedChange.getValue();
        if (selected && entities.length > 0) {
          for (const entity of entities) {
            if (selected.id === entity.id) {
              st_set(this.selectedStorageKey, entity);
              break;
            }
          }
        }
      }),
      shareReplay(1),
    );
  }

  getSingle$(id: number): Observable<GetEventOrLocationResponse> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetEventOrLocationResponse>(`${this.url}/${id}`)));
  }

  clone$(id: number): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(`${this.url}/${id}/clone`, undefined).pipe(tap(() => this.triggerGet$.next(true)));
  }
}

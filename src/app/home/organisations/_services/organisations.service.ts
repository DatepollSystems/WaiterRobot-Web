import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, distinctUntilChanged, Observable, shareReplay, switchMap, tap} from 'rxjs';

import {o_fromStorage, s_from, st_set} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetSelected, HasGetSingle} from 'dfx-helper';

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
    HasGetSelected<GetOrganisationResponse>,
    HasGetAll<GetOrganisationResponse>,
    HasGetSingle<GetOrganisationResponse>,
    HasCreateWithIdResponse<CreateOrganisationDto>,
    HasUpdateWithIdResponse<UpdateOrganisationDto>,
    HasDelete<GetOrganisationResponse>
{
  private url = '/config/organisation';
  private selectedStorageKey = 'selected_org';

  constructor(private httpClient: HttpClient) {}

  create$(dto: CreateOrganisationDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdateEventOrLocationDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }

  private selectedChange = new BehaviorSubject(o_fromStorage<GetOrganisationResponse>(this.selectedStorageKey));

  setSelected(it: GetOrganisationResponse): void {
    st_set(this.selectedStorageKey, it);
    this.selectedChange.next(it);
  }

  getSelected$ = this.selectedChange.asObservable().pipe(distinctUntilChanged(), shareReplay(1));

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetOrganisationResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.httpClient.get<GetOrganisationResponse[]>(this.url)),
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

  getSingle$(id: number): Observable<GetOrganisationResponse> {
    return this.triggerGet$.pipe(switchMap(() => this.httpClient.get<GetOrganisationResponse>(`${this.url}/${id}`)));
  }
}

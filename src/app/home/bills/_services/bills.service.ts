import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable, switchMap} from 'rxjs';

import {HasGetSingle} from 'dfx-helper';

import {getPaginationParams, PageableDto} from '../../../_shared/services/services.interface';
import {GetBillResponse, PaginatedResponseGetBillMinResponse} from '../../../_shared/waiterrobot-backend';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class BillsService implements HasGetSingle<GetBillResponse> {
  url = '/config/billing';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillResponse['id']): Observable<GetBillResponse> {
    return this.triggerRefresh.pipe(switchMap(() => this.httpClient.get<GetBillResponse>(`${this.url}/${id}`)));
  }

  getAllPaginated(
    options: PageableDto,
    tableGroupId?: number,
    tableId?: number,
    waiterId?: number,
    unpaidReasonId?: number,
  ): Observable<PaginatedResponseGetBillMinResponse> {
    let params = getPaginationParams(options);
    if (tableGroupId) {
      params = params.append('tableGroupId', tableGroupId);
    }
    if (tableId) {
      params = params.append('tableId', tableId);
    }
    if (waiterId) {
      params = params.append('waiterId', waiterId);
    }
    if (unpaidReasonId) {
      params = params.append('unpaidReasonId', unpaidReasonId);
    }
    return this.triggerRefresh.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) =>
        this.httpClient.get<PaginatedResponseGetBillMinResponse>(`${this.url}`, {
          params: params.append('eventId', eventId),
        }),
      ),
    );
  }
}

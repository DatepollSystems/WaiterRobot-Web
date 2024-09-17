import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {Download, DownloadService} from '@home-shared/services/download.service';
import {getPaginationParams, PageableDto} from '@home-shared/services/pagination';
import {p_add} from '@shared/params';
import {GetBillResponse, PaginatedResponseGetBillMinResponse} from '@shared/waiterrobot-backend';

import {n_generate_int} from 'dfts-helper';
import {HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, combineLatest, Observable, switchMap, take} from 'rxjs';

import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class BillsService implements HasGetSingle<GetBillResponse> {
  url = '/config/billing';

  private httpClient = inject(HttpClient);
  private downloadService = inject(DownloadService);
  private selectedEventService = inject(SelectedEventService);

  public triggerRefresh = new BehaviorSubject<boolean>(true);

  getSingle$(id: GetBillResponse['id']): Observable<GetBillResponse> {
    return this.triggerRefresh.pipe(switchMap(() => this.httpClient.get<GetBillResponse>(`${this.url}/${id}`)));
  }

  getAllPaginated(
    options: PageableDto,
    tableIds?: number[],
    tableGroupIds?: number[],
    productIds?: number[],
    productGroupIds?: number[],
    waiterIds?: number[],
    unpaidReasonId?: number,
  ): Observable<PaginatedResponseGetBillMinResponse> {
    let params = getPaginationParams(options);

    params = p_add(params, 'tableIds', tableIds);
    params = p_add(params, 'tableGroupIds', tableGroupIds);
    params = p_add(params, 'productIds', productIds);
    params = p_add(params, 'productGroupIds', productGroupIds);
    params = p_add(params, 'waiterIds', waiterIds);
    params = p_add(params, 'unpaidReasonId', unpaidReasonId);

    return combineLatest([this.selectedEventService.selectedIdNotNull$, this.triggerRefresh]).pipe(
      switchMap(([eventId]) =>
        this.httpClient.get<PaginatedResponseGetBillMinResponse>(this.url, {
          params: params.append('eventId', eventId),
        }),
      ),
    );
  }

  download$(): Observable<Download> {
    return this.selectedEventService.selectedIdNotNull$.pipe(
      take(1),
      switchMap((eventId) =>
        this.downloadService.download$(`${this.url}/export/${eventId}`, `bills_export_${n_generate_int(100, 9999)}.csv`),
      ),
    );
  }
}

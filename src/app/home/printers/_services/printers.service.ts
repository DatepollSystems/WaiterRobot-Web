import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';
import {CreatePrinterDto, GetPrinterFontResponse, GetPrinterResponse, IdResponse, UpdatePrinterDto} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {HasGetAll, HasGetSingle} from 'dfx-helper';

import {BehaviorSubject, forkJoin, map, Observable, switchMap, tap} from 'rxjs';
import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';

@Injectable({
  providedIn: 'root',
})
export class PrintersService
  implements
    HasGetSingle<GetPrinterResponse>,
    HasGetAll<GetPrinterResponse>,
    HasCreateWithIdResponse<CreatePrinterDto>,
    HasUpdateWithIdResponse<UpdatePrinterDto>
{
  url = '/config/printer';

  private httpClient = inject(HttpClient);
  private selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetPrinterResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() => this.selectedEventService.selectedIdNotNull$),
      switchMap((eventId) => this.httpClient.get<GetPrinterResponse[]>(this.url, {params: {eventId}})),
      map((it) => {
        it = it.map((ps) => {
          ps.fontScale = ps.fontScale / 10;
          return ps;
        });
        return it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
      }),
    );
  }

  getAllFonts$(): Observable<GetPrinterFontResponse[]> {
    return this.httpClient.get<GetPrinterFontResponse[]>(`${this.url}/fonts`);
  }

  getSingle$(id: number): Observable<GetPrinterResponse> {
    return this.httpClient.get<GetPrinterResponse>(`${this.url}/${s_from(id)}`).pipe(
      map((it) => {
        it.fontScale = it.fontScale / 10;
        return it;
      }),
    );
  }

  create$(dto: CreatePrinterDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  update$(dto: UpdatePrinterDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  deleteAll$(ids: number[]): Observable<unknown> {
    return forkJoin(ids.map((it) => this.httpClient.delete(`${this.url}/${s_from(it)}`))).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}

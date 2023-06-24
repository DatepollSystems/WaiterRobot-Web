import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined, s_from} from 'dfts-helper';
import {HasGetAll, HasGetSingle} from 'dfx-helper';
import {BehaviorSubject, filter, map, Observable, switchMap, tap} from 'rxjs';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '../../../_shared/services/services.interface';
import {CreatePrinterDto, GetPrinterResponse, IdResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

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

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}

  triggerGet$ = new BehaviorSubject(true);

  getAll$(): Observable<GetPrinterResponse[]> {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.eventsService.getSelected$.pipe(
          filter(notNullAndUndefined),
          switchMap((selected) =>
            this.httpClient.get<GetPrinterResponse[]>(this.url, {params: new HttpParams().set('eventId', selected.id)})
          ),
          map((it) => it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())))
        )
      )
    );
  }

  getSingle$(id: number): Observable<GetPrinterResponse> {
    return this.httpClient.get<GetPrinterResponse>(`${this.url}/${s_from(id)}`);
  }

  create$(dto: CreatePrinterDto): Observable<IdResponse> {
    return this.httpClient.post<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  update$(dto: UpdatePrinterDto): Observable<IdResponse> {
    return this.httpClient.put<IdResponse>(this.url, dto).pipe(tap(() => this.triggerGet$.next(true)));
  }

  delete$(id: number): Observable<unknown> {
    return this.httpClient.delete(`${this.url}/${s_from(id)}`).pipe(tap(() => this.triggerGet$.next(true)));
  }
}

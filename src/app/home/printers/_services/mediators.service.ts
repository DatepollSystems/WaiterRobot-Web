import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {HasGetAll} from 'dfx-helper';
import {filter, Observable, switchMap} from 'rxjs';

import {GetMediatorResponse} from '../../../_shared/waiterrobot-backend';

import {OrganisationsService} from '../../organisations/_services/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService implements HasGetAll<GetMediatorResponse> {
  url = '/config/mediator';

  constructor(private httpClient: HttpClient, private organisationsService: OrganisationsService) {}

  getAll$(): Observable<GetMediatorResponse[]> {
    return this.organisationsService.getSelected$.pipe(
      filter(notNullAndUndefined),
      switchMap((organisation) =>
        this.httpClient.get<GetMediatorResponse[]>(this.url, {params: new HttpParams().set('organisationId', organisation.id)})
      )
    );
  }
}

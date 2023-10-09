import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, switchMap} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

import {GetMediatorResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService implements HasGetAll<GetMediatorResponse> {
  url = '/config/mediator';

  constructor(
    private httpClient: HttpClient,
    private organisationsService: OrganisationsService,
  ) {}

  getAll$(): Observable<GetMediatorResponse[]> {
    return this.organisationsService.getSelectedNotNull$.pipe(
      switchMap(({id: organisationId}) => this.httpClient.get<GetMediatorResponse[]>(this.url, {params: {organisationId}})),
    );
  }
}

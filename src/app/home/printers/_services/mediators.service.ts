import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {Observable, switchMap} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

import {GetMediatorResponse} from '../../../_shared/waiterrobot-backend';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService implements HasGetAll<GetMediatorResponse> {
  url = '/config/mediator';

  private httpClient = inject(HttpClient);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  getAll$(): Observable<GetMediatorResponse[]> {
    return this.selectedOrganisationService.selectedIdNotNull$.pipe(
      switchMap((organisationId) => this.httpClient.get<GetMediatorResponse[]>(this.url, {params: {organisationId}})),
    );
  }
}

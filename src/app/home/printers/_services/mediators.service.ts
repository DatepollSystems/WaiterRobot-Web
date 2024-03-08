import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {GetMediatorResponse} from '@shared/waiterrobot-backend';

import {HasGetAll} from 'dfx-helper';

import {Observable, switchMap} from 'rxjs';
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

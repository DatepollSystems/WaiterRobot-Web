import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {DuplicateWaiterModel} from '../../../_models/waiter/duplicate-waiter.model';

import {DuplicateWaiterResponse, MergeWaiterDto} from '../../../_models/waiterrobot-backend';
import {AbstractModelService} from '../abstract-model.service';
import {OrganisationsService} from '../organisation/organisations.service';

@Injectable({
  providedIn: 'root',
})
export class DuplicateWaitersService extends AbstractModelService<DuplicateWaiterModel> {
  constructor(httpClient: HttpClient, private organisationService: OrganisationsService) {
    super(httpClient, '/config/waiter/duplicates');
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.selectedChange.subscribe((org) => {
      if (org) {
        this.setGetAllParams([{key: 'organisationId', value: org.id}]);
        this.getAll();
      }
    });
  }

  protected convert(jsonData: any): DuplicateWaiterModel {
    return new DuplicateWaiterModel(jsonData as DuplicateWaiterResponse);
  }

  public merge(mergeDto: MergeWaiterDto): void {
    this.httpClient.put('/config/waiter/duplicates/merge', mergeDto).subscribe({
      next: () => this.getAll(),
      error: (error) => console.log(error),
    });
  }
}

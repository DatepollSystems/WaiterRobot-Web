import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';
import {OrganisationsService} from '../organisation/organisations.service';

import {DuplicateWaiterModel} from '../../../_models/waiter/duplicate-waiter.model';
import {DuplicateWaiterResponse} from '../../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class DuplicateWaitersService extends AbstractModelService<DuplicateWaiterModel> {
  constructor(httpService: HttpService, private organisationService: OrganisationsService) {
    super(httpService, '/config/waiter/duplicates');
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.selectedChange.subscribe((org) => {
      if (org) {
        this.setGetAllParams([{key: 'organisationId', value: org?.id}]);
        this.getAll();
      }
    });
  }

  protected convert(jsonData: any): DuplicateWaiterModel {
    return new DuplicateWaiterModel(jsonData as DuplicateWaiterResponse);
  }

  public merge(mergeDto: {waiterId: number; waiterIds: number[]}): void {
    this.httpService.put('/config/waiter/duplicates/merge', mergeDto).subscribe({
      next: () => this.getAll(),
      error: (error) => console.log(error),
    });
  }
}

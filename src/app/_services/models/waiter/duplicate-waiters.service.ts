import {Injectable} from '@angular/core';

import {HttpService} from '../../http.service';
import {AbstractModelService} from '../abstract-model.service';
import {OrganisationsService} from '../organisation/organisations.service';

import {DuplicateWaiterModel} from '../../../_models/waiter/duplicate-waiter.model';

@Injectable({
  providedIn: 'root',
})
export class DuplicateWaitersService extends AbstractModelService<DuplicateWaiterModel> {
  constructor(httpService: HttpService, private organisationService: OrganisationsService) {
    super(httpService, '/config/waiter/duplicates');
    this.setGetAllParams([{key: 'organisation_id', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.selectedChange.subscribe((org) => {
      this.setGetAllParams([{key: 'organisation_id', value: org?.id}]);
    });
  }

  protected convert(jsonData: any): DuplicateWaiterModel {
    return new DuplicateWaiterModel(jsonData);
  }

  public merge(mergeDto: {waiter_id: number; waiter_ids: number[]}): void {
    this.httpService.put('/config/waiter/duplicates/merge', mergeDto).subscribe(
      () => this.getAll(),
      (error) => console.log(error)
    );
  }
}

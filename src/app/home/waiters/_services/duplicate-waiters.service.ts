import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

import {DuplicateWaiterResponse, MergeWaiterDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {DuplicateWaiterModel} from '../_models/duplicate-waiter.model';

@Injectable({providedIn: 'root'})
export class DuplicateWaitersService extends AbstractModelService<DuplicateWaiterModel> {
  url = '/config/waiter/duplicates';

  constructor(httpClient: HttpClient, private organisationService: OrganisationsService) {
    super(httpClient);
    this.setGetAllParams([{key: 'organisationId', value: this.organisationService.getSelected()?.id}]);
    this.organisationService.getSelected$.subscribe((it) => {
      if (it) {
        this.setGetAllParams([{key: 'organisationId', value: it.id}]);
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

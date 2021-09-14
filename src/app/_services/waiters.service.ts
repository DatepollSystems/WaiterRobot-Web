import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {HttpService} from './http.service';
import {WaiterModel} from '../_models/waiter.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WaitersService extends AModelService<WaiterModel> {

  private organisationWaiters: WaiterModel[] = [];
  public organisationWaitersChange: Subject<WaiterModel[]> = new Subject<WaiterModel[]>();

  constructor(httpService: HttpService) {
    super(httpService, '/config/waiter');
  }

  protected convert(jsonData: any): WaiterModel {
    return new WaiterModel(jsonData);
  }

  private setOrganisationWaiters(waiters: WaiterModel[]): void {
    this.organisationWaiters = waiters;
    this.organisationWaitersChange.next(this.organisationWaiters.slice());
  }

  public getOrganisationWaiters(organisation_id: number): WaiterModel[] {
    this.fetchOrganisationWaiters(organisation_id);
    return this.organisationWaiters.slice();
  }

  private fetchOrganisationWaiters(organisation_id: number): void {
    this.httpService.get('/config/waiter?organisation_id=' + organisation_id, 'fetchOrganisationWaiters').subscribe(
      (data: any) => {
        const waiters = [];
        for (const waiterData of data) {
          waiters.push(new WaiterModel(waiterData));
        }
        this.setOrganisationWaiters(waiters);
      },
      (error: any) => console.log(error)
    );
  }

}

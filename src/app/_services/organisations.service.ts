import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {HttpService} from './http.service';
import {OrganisationsModel} from '../_models/organisations';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService extends AModelService<OrganisationsModel>{
  protected getAllUrl = '/config/organisation/all';

  private selected: OrganisationsModel | undefined;
  public selectedChange: Subject<OrganisationsModel> = new Subject<OrganisationsModel>();

  constructor(httpService: HttpService) {
    super(httpService, '/config/organisation');
  }

  protected convert(data: any): OrganisationsModel {
    return new OrganisationsModel(data);
  }

  public getSelected(): OrganisationsModel|undefined {
    this.fetchSelected();
    return this.selected;
  }

  private setSelected(selected: OrganisationsModel): void {
    this.selected = selected;
    this.selectedChange.next(this.selected);
  }

  public fetchSelected(): void {
    this.httpService.get('/config/organisation/my', 'fetchSelected').subscribe(
      (data: any) => {
        console.log(data);
        this.setSelected(this.convert(data));
      },
      (error: any) => console.log(error)
    );
  }
}

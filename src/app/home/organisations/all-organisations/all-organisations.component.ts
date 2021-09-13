import {Component} from '@angular/core';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {AModelsListComponent} from '../../../_helper/a-models-list.component';
import {MyUserService} from '../../../_services/myUser.service';
import {OrganisationsService} from '../../../_services/organisations.service';
import {OrganisationModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss']
})
export class AllOrganisationsComponent extends AModelsListComponent<OrganisationModel> {
  myUser: UserModel | null = null;
  myUserSubscription: Subscription;

  constructor(private myUserService: MyUserService, private organisationsService: OrganisationsService) {
    super(organisationsService);

    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });
  }

  protected checkFilterForModel(filter: string, model: OrganisationModel): OrganisationModel | undefined {
    if (TypeHelper.numberToString(model.id) == filter
      || model.name.trim().toLowerCase().includes(filter)
      || model.street.trim().toLowerCase().includes(filter)
      || model.postal_code.trim().toLowerCase().includes(filter)
      || model.city.trim().toLowerCase().includes(filter)
      || model.country_code.trim().toLowerCase().includes(filter)
      || model.street_number.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.myUserSubscription.unsubscribe();
  }

  onSelect(organisation: OrganisationModel) {
    this.organisationsService.setSelected(organisation);
  }
}

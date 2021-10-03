import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {MyUserService} from '../../../_services/my-user.service';
import {OrganisationsService} from '../../../_services/organisations.service';

import {OrganisationModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss'],
})
export class AllOrganisationsComponent extends AbstractModelsListComponent<OrganisationModel> {
  myUser: UserModel | undefined;

  constructor(modal: NgbModal, private myUserService: MyUserService, private organisationsService: OrganisationsService) {
    super(organisationsService, modal);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );
  }

  protected checkFilterForModel(filter: string, model: OrganisationModel): OrganisationModel | undefined {
    if (
      Converter.numberToString(model.id) == filter ||
      model.name.trim().toLowerCase().includes(filter) ||
      model.street.trim().toLowerCase().includes(filter) ||
      model.postal_code.trim().toLowerCase().includes(filter) ||
      model.city.trim().toLowerCase().includes(filter) ||
      model.country_code.trim().toLowerCase().includes(filter) ||
      model.street_number.trim().toLowerCase().includes(filter)
    ) {
      return model;
    }
    return undefined;
  }

  onSelect(organisation: OrganisationModel) {
    this.organisationsService.setSelected(organisation);
  }
}

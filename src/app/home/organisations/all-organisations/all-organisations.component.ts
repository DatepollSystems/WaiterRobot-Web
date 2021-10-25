import {Component} from '@angular/core';

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
  override columnsToDisplay = ['id', 'name', 'street', 'street_number', 'postal_code', 'city', 'country_code', 'actions'];

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

  onSelect(organisation: OrganisationModel): void {
    this.organisationsService.setSelected(organisation);
  }
}

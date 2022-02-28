import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {MyUserService} from '../../../_services/auth/my-user.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {UserModel} from '../../../_models/user/user.model';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss'],
})
export class AllOrganisationsComponent extends AbstractModelsListComponent<OrganisationModel> {
  override columnsToDisplay = ['id', 'name', 'street', 'street_number', 'postal_code', 'city', 'country_code', 'actions'];

  myUser: UserModel | undefined;
  selectedOrganisation: OrganisationModel | undefined;

  constructor(modal: NgbModal, private myUserService: MyUserService, public organisationsService: OrganisationsService) {
    super(modal, organisationsService);

    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      })
    );
  }

  onSelect(organisation: OrganisationModel | undefined): void {
    this.organisationsService.setSelected(organisation);
  }
}

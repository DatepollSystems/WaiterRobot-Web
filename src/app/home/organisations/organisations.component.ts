import {Component} from '@angular/core';

import {AbstractComponent} from '../../_helper/abstract-component';
import {MyUserService} from '../../_services/myUser.service';
import {OrganisationsService} from '../../_services/organisations.service';

import {OrganisationModel} from '../../_models/organisation.model';
import {UserModel} from '../../_models/user.model';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent extends AbstractComponent {
  myUser: UserModel | null = null;
  organisations: OrganisationModel[];
  maxOrgsCount = 5;
  selectedOrganisation: OrganisationModel | undefined;

  constructor(private myUserService: MyUserService, private organisationsService: OrganisationsService) {
    super();
    this.myUser = this.myUserService.getUser();
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.myUser = user;
      })
    );

    this.organisations = this.organisationsService.getAll();
    this.autoUnsubscribe(
      this.organisationsService.allChange.subscribe((value: OrganisationModel[]) => {
        this.organisations = value;
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
      })
    );
  }
}

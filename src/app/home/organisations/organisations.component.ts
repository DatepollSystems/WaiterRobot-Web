import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';

import {OrganisationModel} from './_models/organisation.model';

import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent extends AComponent {
  organisations: OrganisationModel[];
  maxOrgsCount = 5;
  selectedOrganisation: OrganisationModel | undefined;

  constructor(myUserService: MyUserService, organisationsService: OrganisationsService) {
    super();

    this.organisations = organisationsService.getAll();
    this.selectedOrganisation = organisationsService.getSelected();

    this.unsubscribe(
      organisationsService.allChange.subscribe((value: OrganisationModel[]) => {
        this.organisations = value;
      }),
      organisationsService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
      })
    );
  }
}

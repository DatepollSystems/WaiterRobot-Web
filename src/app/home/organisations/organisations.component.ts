import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';

import {OrganisationModel} from '../../_models/organisation/organisation.model';

import {MyUserService} from '../../_services/auth/my-user.service';
import {OrganisationsService} from '../../_services/models/organisation/organisations.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent extends AComponent {
  organisations: OrganisationModel[];
  maxOrgsCount = 5;
  selectedOrganisation: OrganisationModel | undefined;

  constructor(private myUserService: MyUserService, private organisationsService: OrganisationsService) {
    super();

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

import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MyUserModel} from 'src/app/_models/user/my-user.model';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {MyUserService} from '../../../_services/auth/my-user.service';
import {EventsService} from '../../../_services/models/events.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss'],
})
export class AllOrganisationsComponent extends AbstractModelsListComponent<OrganisationModel> {
  override columnsToDisplay = ['id', 'name', 'street', 'streetNumber', 'postalCode', 'city', 'countryCode', 'actions'];

  myUser?: MyUserModel;
  selectedOrganisation?: OrganisationModel;

  constructor(
    modal: NgbModal,
    private myUserService: MyUserService,
    public organisationsService: OrganisationsService,
    private eventsService: EventsService
  ) {
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

  onSelect = (): void => {
    this.eventsService.setSelected(undefined);
  };
}

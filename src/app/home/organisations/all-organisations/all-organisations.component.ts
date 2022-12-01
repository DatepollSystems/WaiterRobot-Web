import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MyUserModel} from 'src/app/_shared/services/auth/user/my-user.model';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';

import {OrganisationModel} from '../_models/organisation.model';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {EventsService} from '../../events/_services/events.service';
import {OrganisationsService} from '../_services/organisations.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss'],
})
export class AllOrganisationsComponent extends AbstractModelsListComponent<OrganisationModel> {
  override columnsToDisplay = ['id', 'name', 'street', 'streetNumber', 'postalCode', 'city', 'countryCode', 'actions'];

  myUser$: Observable<MyUserModel>;
  selectedOrganisation?: OrganisationModel;

  constructor(
    modal: NgbModal,
    private myUserService: MyUserService,
    public organisationsService: OrganisationsService,
    private eventsService: EventsService
  ) {
    super(modal, organisationsService);
    this.setSelectable();

    this.myUser$ = this.myUserService.getUser$();

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.unsubscribe(this.organisationsService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)));
  }
}

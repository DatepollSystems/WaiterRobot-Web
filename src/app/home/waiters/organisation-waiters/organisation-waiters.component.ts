import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {WaiterModel} from '../../../_models/waiter/waiter.model';
import {GetEventOrLocationMinResponse} from '../../../_models/waiterrobot-backend';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';
import {WaitersService} from '../../../_services/models/waiter/waiters.service';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss'],
})
export class OrganisationWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  override columnsToDisplay = ['name', 'activated', 'events', 'actions'];

  selectedOrganisation: OrganisationModel | undefined;

  constructor(protected entitiesService: WaitersService, organisationsService: OrganisationsService, modal: NgbModal) {
    super(modal, entitiesService);

    this.setSelectable();

    this.selectedOrganisation = organisationsService.getSelected();
    this.unsubscribe(organisationsService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)));
    this.entitiesService.setSelectedOrganisationGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedOrganisationGetAllUrl();
    super.initializeEntities();
  }

  onMap = (it: GetEventOrLocationMinResponse) => it.name;
}

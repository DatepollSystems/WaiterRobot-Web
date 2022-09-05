import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StringHelper} from 'dfx-helper';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {WaiterModel} from '../../../_models/waiter/waiter.model';
import {GetWaiterMinResponse} from '../../../_models/waiterrobot-backend';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';
import {WaitersService} from '../../../_services/models/waiter/waiters.service';
import {getEventsName} from '../waiters.module';

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
    this.autoUnsubscribe(
      organisationsService.selectedChange.subscribe((org) => {
        this.selectedOrganisation = org;
      })
    );
    this.entitiesService.setSelectedOrganisationGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedOrganisationGetAllUrl();
    super.initializeEntities();
  }

  public getEventsName = (events: GetWaiterMinResponse[]) => getEventsName(events);
}

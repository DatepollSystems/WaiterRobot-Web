import {Component} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {WaitersService} from '../../../_services/models/waiters.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';

import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {WaiterModel} from '../../../_models/waiter.model';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss'],
})
export class OrganisationWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  override columnsToDisplay = ['name', 'activated', 'actions'];

  selectedOrganisation: OrganisationModel | undefined;

  constructor(protected entitiesService: WaitersService, organisationsService: OrganisationsService, modal: NgbModal) {
    super(modal, entitiesService);

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
}

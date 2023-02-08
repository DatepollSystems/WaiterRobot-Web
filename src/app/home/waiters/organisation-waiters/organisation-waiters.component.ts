import {Component} from '@angular/core';

import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';

import {OrganisationModel} from '../../organisations/_models/organisation.model';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {WaiterModel} from '../_models/waiter.model';
import {WaitersService} from '../_services/waiters.service';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss'],
})
export class OrganisationWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  override columnsToDisplay = ['name', 'activated', 'events', 'actions'];

  selectedOrganisation: OrganisationModel | undefined;

  constructor(protected entitiesService: WaitersService, organisationsService: OrganisationsService) {
    super(entitiesService);

    this.setSelectable();

    this.selectedOrganisation = organisationsService.getSelected();
    this.unsubscribe(organisationsService.getSelected$.subscribe((it) => (this.selectedOrganisation = it)));
    this.entitiesService.setSelectedOrganisationGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedOrganisationGetAllUrl();
    super.initializeEntities();
  }
}

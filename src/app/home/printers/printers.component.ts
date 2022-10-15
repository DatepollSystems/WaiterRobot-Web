import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractModelsComponent} from '../../_helper/abstract-models.component';

import {EventsService} from '../../_services/models/events.service';
import {OrganisationsService} from '../../_services/models/organisation/organisations.service';

import {EventModel} from '../../_models/event.model';
import {OrganisationModel} from '../../_models/organisation/organisation.model';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent extends AbstractModelsComponent<EventModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(organisationService: OrganisationsService, eventsService: EventsService, router: Router) {
    super(router, eventsService);

    this.selectedOrganisation = organisationService.getSelected();
    this.selectedEvent = eventsService.getSelected();

    this.unsubscribe(
      organisationService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      }),
      eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }
}

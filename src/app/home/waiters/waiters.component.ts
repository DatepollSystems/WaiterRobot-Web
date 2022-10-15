import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractModelsComponent} from '../../_helper/abstract-models.component';
import {EventModel} from '../../_models/event.model';

import {OrganisationModel} from '../../_models/organisation/organisation.model';
import {EventsService} from '../../_services/models/events.service';

import {OrganisationsService} from '../../_services/models/organisation/organisations.service';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss'],
})
export class WaitersComponent extends AbstractModelsComponent<EventModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(organisationService: OrganisationsService, eventsService: EventsService, router: Router) {
    super(router, eventsService);

    this.selectedOrganisation = organisationService.getSelected();
    this.selectedEvent = eventsService.getSelected();

    this.unsubscribe(
      organisationService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)),
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it))
    );
  }
}

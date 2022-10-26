import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractModelsComponent} from '../../_shared/ui/abstract-models.component';
import {EventModel} from '../events/_models/event.model';

import {OrganisationModel} from '../organisations/_models/organisation.model';
import {EventsService} from '../events/_services/events.service';

import {OrganisationsService} from '../organisations/_services/organisations.service';

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

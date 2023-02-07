import {Component} from '@angular/core';
import {AbstractModelsComponent} from '../../_shared/ui/abstract-models.component';
import {EventModel} from '../events/_models/event.model';
import {EventsService} from '../events/_services/events.service';

import {OrganisationModel} from '../organisations/_models/organisation.model';

import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss'],
})
export class WaitersComponent extends AbstractModelsComponent<EventModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(organisationService: OrganisationsService, eventsService: EventsService) {
    super(eventsService);

    this.selectedOrganisation = organisationService.getSelected();
    this.selectedEvent = eventsService.getSelected();

    this.unsubscribe(
      organisationService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)),
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it))
    );
  }
}

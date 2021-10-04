import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {OrganisationsService} from '../../_services/organisations.service';
import {EventsService} from '../../_services/events.service';

import {OrganisationModel} from '../../_models/organisation.model';
import {EventModel} from '../../_models/event.model';
import {AbstractModelsComponent} from '../../_helper/abstract-models.component';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss'],
})
export class WaitersComponent extends AbstractModelsComponent<EventModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;

  constructor(private organisationService: OrganisationsService, eventsService: EventsService, router: Router) {
    super(router, eventsService);

    this.selectedOrganisation = this.organisationService.getSelected();
    this.autoUnsubscribe(
      this.organisationService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      })
    );

    this.selectedEvent = eventsService.getSelected();
    this.autoUnsubscribe(
      eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );
  }
}

import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractComponent, LoggerFactory} from 'dfx-helper';

import {OrganisationsService} from '../../_services/organisations.service';
import {EventsService} from '../../_services/events.service';

import {OrganisationModel} from '../../_models/organisation.model';
import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss'],
})
export class WaitersComponent extends AbstractComponent {
  selectedEventToShow = 'default';

  selectedOrganisation: OrganisationModel | undefined;
  selectedEvent: EventModel | undefined;
  allEvents: EventModel[];

  private log = LoggerFactory.getLogger('WaitersComponent');

  constructor(private organisationService: OrganisationsService, private eventsService: EventsService, private router: Router) {
    super();

    this.selectedOrganisation = this.organisationService.getSelected();
    this.autoUnsubscribe(
      this.organisationService.selectedChange.subscribe((value) => {
        this.selectedOrganisation = value;
      })
    );

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((value) => {
        this.selectedEvent = value;
      })
    );

    this.allEvents = this.eventsService.getAll();
    this.autoUnsubscribe(
      this.eventsService.allChange.subscribe((events) => {
        this.allEvents = events;
      })
    );
  }

  linkClick() {
    this.selectedEventToShow = 'default';
  }

  showEvent(value: any) {
    if (value.includes('default')) {
      return;
    }
    this.log.info('showEvent', 'Showing event "' + value + '"');
    this.router.navigateByUrl(value).then();
  }
}

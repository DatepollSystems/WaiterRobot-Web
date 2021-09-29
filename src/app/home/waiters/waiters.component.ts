import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';
import {LoggerFactory} from 'dfx-helper';

import {OrganisationsService} from '../../_services/organisations.service';
import {EventsService} from '../../_services/events.service';
import {OrganisationModel} from '../../_models/organisation.model';
import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-waiters',
  templateUrl: './waiters.component.html',
  styleUrls: ['./waiters.component.scss'],
})
export class WaitersComponent implements OnDestroy {
  selectedEventToShow = 'default';

  selectedOrganisation: OrganisationModel | undefined;
  selectedOrganisationSubscription: Subscription;

  selectedEvent: EventModel | undefined;
  selectedEventSubscription: Subscription;

  allEvents: EventModel[];
  allEventsSubscription: Subscription;

  private log = LoggerFactory.getLogger('WaitersComponent');

  constructor(private organisationService: OrganisationsService, private eventsService: EventsService, private router: Router) {
    this.selectedOrganisation = this.organisationService.getSelected();
    this.selectedOrganisationSubscription = this.organisationService.selectedChange.subscribe((value) => {
      this.selectedOrganisation = value;
    });

    this.selectedEvent = this.eventsService.getSelected();
    this.selectedEventSubscription = this.eventsService.selectedChange.subscribe((value) => {
      this.selectedEvent = value;
    });

    this.allEvents = this.eventsService.getAll();
    this.allEventsSubscription = this.eventsService.allChange.subscribe((value) => {
      this.allEvents = value;
    });
  }

  ngOnDestroy(): void {
    this.selectedOrganisationSubscription.unsubscribe();
    this.selectedEventSubscription.unsubscribe();
    this.allEventsSubscription.unsubscribe();
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

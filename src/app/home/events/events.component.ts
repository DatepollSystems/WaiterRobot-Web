import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {EventsService} from '../../_services/events.service';
import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnDestroy {
  events: EventModel[];
  eventsSubscription: Subscription;

  selectedEvent: EventModel | null;
  selectedEventSubscription: Subscription;

  constructor(private eventsService: EventsService) {
    this.events = this.eventsService.getAll().slice(0, 5);
    this.eventsSubscription = this.eventsService.allChange.subscribe((value: EventModel[]) => {
      this.events = value.slice(0, 5);
    });

    this.selectedEvent = this.eventsService.getSelected();
    this.selectedEventSubscription = this.eventsService.selectedChange.subscribe((value: EventModel | null) => {
      this.selectedEvent = value;
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    this.selectedEventSubscription.unsubscribe();
  }

}

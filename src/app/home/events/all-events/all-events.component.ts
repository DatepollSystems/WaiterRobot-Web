import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

import {compare, SortableHeader, SortEvent} from '../../../_helper/table-sortable';

import {EventsService} from '../../../_services/events.service';
import {EventModel} from '../../../_models/event.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AllEventsComponent implements OnDestroy {
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;
  filter = new FormControl('');

  events: EventModel[];
  eventsCopy: EventModel[];
  eventsSubscription: Subscription;

  constructor(private eventsService: EventsService) {
    this.events = this.eventsService.getAll();
    this.eventsCopy = this.events.slice();
    this.eventsSubscription = this.eventsService.allChange.subscribe(value => {
      this.events = value;
      this.eventsCopy = this.events.slice();
    });

    this.filter.valueChanges.subscribe(value => {
      if (value == null) {
        this.eventsCopy = this.events.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.eventsCopy = [];
      for (const org of this.events) {
        if (org.id == value
          || org.name.trim().toLowerCase().includes(value)
          || org.street.trim().toLowerCase().includes(value)
          || org.postal_code.trim().toLowerCase().includes(value)
          || org.city.trim().toLowerCase().includes(value)
          || org.date?.toString().trim().toLowerCase().includes(value)
          || org.street_number.trim().toLowerCase().includes(value)) {
          this.eventsCopy.push(org);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  onSelect(event: EventModel) {
    this.eventsService.setSelected(event);
  }

  onDelete(id: number) {
    this.eventsService.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.eventsCopy = this.events.slice();
    } else {
      this.eventsCopy = [...this.events].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}

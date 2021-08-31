import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {EventsService} from '../../../_services/events.service';
import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user.model';
import {MyUserService} from '../../../_services/myUser.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnDestroy {
  isEdit = false;
  active = 1;

  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  event: EventModel | undefined;
  _eventSubscription: Subscription | undefined;

  selectedEvent!: EventModel | null;
  selectedEventSubscription: Subscription | undefined;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private myUserService: MyUserService,
              private eventsService: EventsService) {
    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.route.queryParams.subscribe((params => {
      if (params?.tab != null) {
        this.active = TypeHelper.stringToNumber(params?.tab);
      }
    }));

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          console.log('Event to open: ' + id);
          this.event = this.eventsService.getSingle(TypeHelper.stringToNumber(id));
          this._eventSubscription = this.eventsService.singleChange.subscribe((value: EventModel) => {
            this.event = value;
          });
          this.isEdit = true;

          this.selectedEvent = this.eventsService.getSelected();
          this.selectedEventSubscription = this.eventsService.selectedChange.subscribe((value: EventModel|null) => {
            this.selectedEvent = value;
          });
        } else {
          this.isEdit = false;
          console.log('Create new event');

          // Tab 2 is the statistics tab which does not exist on create event
          if (this.active == 2) {
            this.active = 1;
          }
        }
      } else {
        console.log('No event to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.myUserSubscription.unsubscribe();
    this._eventSubscription?.unsubscribe();
    this.selectedEventSubscription?.unsubscribe();
  }

  onNavChange($event: any) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: $event.nextId},
        queryParamsHandling: 'merge',
      }).then();
  }

  onSelect(event: EventModel | null) {
    this.eventsService.setSelected(event);
  }

  onSave(f: NgForm) {
    const values = f.form.value;
    let org = new EventModel(values);
    console.log(org);
    if (this.isEdit && this.event?.id != null) {
      org.id = this.event?.id;
      this.eventsService.update(org);
    } else {
      this.eventsService.create(org);
    }
    this.router.navigateByUrl('/home/events/all').then();
  }

  delete(eventId: number) {
    this.eventsService.delete(eventId);
    this.router.navigateByUrl('/home/events/all').then();
  }
}

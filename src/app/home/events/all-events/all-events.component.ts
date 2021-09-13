import {Component} from '@angular/core';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {AModelsListComponent} from '../../../_helper/a-models-list.component';
import {EventsService} from '../../../_services/events.service';
import {MyUserService} from '../../../_services/myUser.service';
import {EventModel} from '../../../_models/event.model';
import {UserModel} from '../../../_models/user.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AllEventsComponent extends AModelsListComponent<EventModel> {
  myUser: UserModel | null = null;
  myUserSubscription: Subscription;

  constructor(private myUserService: MyUserService, private eventsService: EventsService) {
    super(eventsService);

    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });
  }

  protected checkFilterForModel(filter: string, model: EventModel): EventModel | undefined {
    if (TypeHelper.numberToString(model.id) === filter
      || model.name.trim().toLowerCase().includes(filter)
      || model.street.trim().toLowerCase().includes(filter)
      || model.postal_code.trim().toLowerCase().includes(filter)
      || model.city.trim().toLowerCase().includes(filter)
      || model.date?.toString().trim().toLowerCase().includes(filter)
      || model.street_number.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.myUserSubscription.unsubscribe();
  }

  onSelect(event: EventModel): void {
    this.eventsService.setSelected(event);
  }
}

import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  selector: 'app-statistics-sum-productgroups',
  templateUrl: './statistics-sum-productgroups.component.html',
  styleUrls: ['./statistics-sum-productgroups.component.scss'],
})
export class StatisticsSumProductgroupsComponent extends AComponent {
  sumDtos?: {name: string; value: number}[];

  constructor(http: HttpClient, eventsServie: EventsService) {
    super();

    this.unsubscribe(
      http
        .get<typeof this.sumDtos>('/config/statistics/sumProductGroups', {
          params: new HttpParams().set('eventId', eventsServie.getSelected()!.id),
        })
        .subscribe((it) => (this.sumDtos = it))
    );
  }
}

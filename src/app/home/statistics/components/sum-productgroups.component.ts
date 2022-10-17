import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  template: ` <app-sum-statistics [sumDtos]="sumDtos" chartType="PIE">{{ 'HOME_PROD_GROUP' | tr }}</app-sum-statistics> `,
  selector: 'app-statistics-sum-productgroups',
})
export class SumProductgroupsComponent extends AComponent {
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

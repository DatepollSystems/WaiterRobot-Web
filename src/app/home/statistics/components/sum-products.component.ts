import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {filter, map, switchMap} from 'rxjs';
import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template: `
    <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos">
      <span>{{ 'HOME_PROD_ALL' | tr }}</span>
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsComponent {
  @Input() set standalone(it: BooleanInput) {
    this._standalone = coerceBooleanProperty(it);
  }
  _standalone = false;

  sumDtos$ = this.eventsService.getSelected$.pipe(
    filter(notNullAndUndefined),
    switchMap((event) =>
      this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProducts', {params: new HttpParams().set('eventId', event.id)})
    ),
    map((it) => (this._standalone ? it : it.slice(0, 20)))
  );

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}
}

import {HttpClient, HttpParams} from '@angular/common/http';
import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {notNullAndUndefined} from 'dfts-helper';
import {filter, map, switchMap} from 'rxjs';
import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template: `
    <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos">
      <span>{{ 'HOME_PROD_ALL' | tr }}</span>
      <div bottom>
        <a class="btn btn-outline-secondary btn-sm" *ngIf="!standalone" routerLink="../products">{{ 'SHOW_ALL' | tr }}</a>
        <back-button *ngIf="standalone" />
      </div>
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsComponent {
  @Input({transform: booleanAttribute}) standalone = true;

  sumDtos$ = this.eventsService.getSelected$.pipe(
    filter(notNullAndUndefined),
    switchMap((event) =>
      this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProducts', {params: new HttpParams().set('eventId', event.id)}),
    ),
    map((it) => (this.standalone ? it : it.slice(0, 20))),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}
}

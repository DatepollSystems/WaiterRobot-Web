import {HttpClient} from '@angular/common/http';
import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {map, switchMap} from 'rxjs';

import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template: `
    <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos" [height]="sumDtos.length * 3">
      <span>{{ 'HOME_PROD_ALL' | tr }}</span>
      <div top *ngIf="standalone">
        <scrollable-toolbar>
          <back-button />
          <div>
            <button class="btn btn-primary btn-sm" print printSectionId="chart">
              <bi name="printer" />
              {{ 'PRINT' | tr }}
            </button>
          </div>
        </scrollable-toolbar>
      </div>
      <div bottom>
        <a class="btn btn-info btn-sm" *ngIf="!standalone" routerLink="../products">{{ 'SHOW_ALL' | tr }}</a>
      </div>
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsComponent {
  @Input({transform: booleanAttribute}) standalone = true;

  sumDtos$ = this.eventsService.getSelectedNotNull$.pipe(
    switchMap(({id: eventId}) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProducts', {params: {eventId}})),
    map((it) => (this.standalone ? it : it.slice(0, 20))),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}
}

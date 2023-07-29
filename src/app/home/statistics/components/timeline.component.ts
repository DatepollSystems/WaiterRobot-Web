import {formatDate} from '@angular/common';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import * as shape from 'd3-shape';
import {d_format, d_formatWithHoursMinutesAndSeconds, d_from, notNullAndUndefined} from 'dfts-helper';
import {BehaviorSubject, combineLatest, debounceTime, filter, map, startWith, switchMap} from 'rxjs';
import {StatisticsTimelineResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

type timelinePrecision = 'ONE_HOUR' | 'THREE_HOURS' | 'SIX_HOURS' | 'TWELVE_HOURS' | 'ONE_DAY' | 'THREE_DAYS' | 'ONE_WEEK' | 'ONE_MONTH';
type timelineType = 'PRODUCTS' | 'WAITERS' | 'PRODUCT_GROUPS';

@Component({
  template: `
    <div class="card">
      <div class="card-body">
        <h4>{{ 'HOME_STATISTICS_ORDER_HISTORY' | tr }}</h4>
        <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <div class="d-flex flex-wrap gap-2">
            <div class="form-group">
              <div class="input-group">
                <input
                  type="text"
                  ngbDatepicker
                  class="form-control bg-dark text-white"
                  id="date"
                  [formControl]="dateFormControl"
                  #datePicker="ngbDatepicker"
                  name="date"
                />
                <button class="btn btn-outline-light" (click)="datePicker.toggle()" type="button">
                  <i-bs name="calendar-date" />
                </button>
              </div>
            </div>
            <ngb-timepicker [spinners]="false" [formControl]="timeFormControl" />
          </div>
          <div class="d-flex flex-wrap gap-2">
            <div
              class="btn-group flex-wrap"
              role="group"
              aria-label="Timespan select"
              *ngIf="selectedTimelinePrecision$ | async as selected"
            >
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'ONE_HOUR'"
                (click)="selectedTimelinePrecision$.next('ONE_HOUR')"
              >
                {{ 'HOME_STATISTICS_ONE_HOUR' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'THREE_HOURS'"
                (click)="selectedTimelinePrecision$.next('THREE_HOURS')"
              >
                {{ 'HOME_STATISTICS_THREE_HOURS' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'SIX_HOURS'"
                (click)="selectedTimelinePrecision$.next('SIX_HOURS')"
              >
                {{ 'HOME_STATISTICS_SIX_HOURS' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'TWELVE_HOURS'"
                (click)="selectedTimelinePrecision$.next('TWELVE_HOURS')"
              >
                {{ 'HOME_STATISTICS_TWELVE_HOURS' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'ONE_DAY'"
                (click)="selectedTimelinePrecision$.next('ONE_DAY')"
              >
                {{ 'HOME_STATISTICS_ONE_DAY' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'THREE_DAYS'"
                (click)="selectedTimelinePrecision$.next('THREE_DAYS')"
              >
                {{ 'HOME_STATISTICS_THREE_DAYS' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'ONE_WEEK'"
                (click)="selectedTimelinePrecision$.next('ONE_WEEK')"
              >
                {{ 'HOME_STATISTICS_ONE_WEEK' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                [class.active]="selected === 'ONE_MONTH'"
                (click)="selectedTimelinePrecision$.next('ONE_MONTH')"
              >
                {{ 'HOME_STATISTICS_ONE_MONTH' | tr }}
              </button>
            </div>
            <div class="btn-group" role="group" aria-label="Basic example" *ngIf="selectedTimelineType$ | async as selected">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                [class.active]="selected === 'PRODUCTS'"
                (click)="selectedTimelineType$.next('PRODUCTS')"
              >
                {{ 'HOME_PROD_ALL' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                [class.active]="selected === 'PRODUCT_GROUPS'"
                (click)="selectedTimelineType$.next('PRODUCT_GROUPS')"
              >
                {{ 'HOME_PROD_GROUP' | tr }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                [class.active]="selected === 'WAITERS'"
                (click)="selectedTimelineType$.next('WAITERS')"
              >
                {{ 'NAV_WAITERS' | tr }}
              </button>
            </div>
          </div>
        </div>
        <hr />
        <ng-container *ngIf="timelineResponse$ | async as timelineResponse; else noData">
          <div style="height: 30vh; width: 98%" *ngIf="timelineResponse.data.length > 0; else noData">
            <ngx-charts-line-chart
              class="position-absolute"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [showGridLines]="true"
              [yScaleMax]="timelineResponse.highestValue"
              [xAxis]="true"
              [yAxis]="true"
              [xAxisTickFormatting]="xFormatting"
              [legend]="false"
              xAxisLabel="{{ 'DATE' | tr }}"
              yAxisLabel="{{ 'COUNT' | tr }}"
              [timeline]="true"
              [curve]="curve"
              [results]="timelineResponse.data"
            />
          </div>
        </ng-container>

        <ng-template #noData>
          <h5 class="text-center my-4">{{ 'HOME_STATISTICS_NO_DATA_FOR_THIS_TIME' | tr }}</h5>
        </ng-template>
      </div>
    </div>
  `,
  selector: 'app-statistics-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  curve = shape.curveCatmullRom;

  dateFormControl = new FormControl(d_format(new Date()));
  timeFormControl = new FormControl({hour: new Date().getHours(), minute: new Date().getMinutes()});

  selectedTimelinePrecision$ = new BehaviorSubject<timelinePrecision>('ONE_HOUR');
  selectedTimelineType$ = new BehaviorSubject<timelineType>('PRODUCTS');

  timelineResponse$ = combineLatest([
    this.eventsService.getSelected$.pipe(filter(notNullAndUndefined)),
    this.selectedTimelinePrecision$.asObservable(),
    this.selectedTimelineType$.asObservable(),
    this.dateFormControl.valueChanges.pipe(
      filter(notNullAndUndefined),
      filter((it) => it !== 'NaN-NaN-NaN' && new Date(it).toString() !== 'Invalid Date'),
      debounceTime(400),
      startWith(d_format(new Date())),
    ),
    this.timeFormControl.valueChanges.pipe(
      filter(notNullAndUndefined),
      debounceTime(200),
      startWith({hour: new Date().getHours(), minute: new Date().getMinutes()}),
    ),
  ]).pipe(
    switchMap(([event, precision, type, dateS, time]) => {
      const date = new Date(dateS);
      date.setHours(time.hour);
      date.setMinutes(time.minute);
      let params = new HttpParams().set('eventId', event.id);
      params = params.append(
        'startDate',
        d_formatWithHoursMinutesAndSeconds(date.toLocaleString('en-US', {timeZone: 'UTC'})).replace(' ', 'T'),
      );
      params = params.append('precision', precision);
      params = params.append('type', type);
      return this.httpClient.get<StatisticsTimelineResponse>('/config/statistics/timeline', {params});
    }),
    map((it) => {
      it.highestValue += 5;
      it.data = it.data.map((iit) => {
        iit.series = iit.series.map((iiit) => {
          iiit.name = formatDate(iiit.name, 'YYYY-MM-ddTHH:mm:ss', 'de-AT');
          return iiit;
        });
        return iit;
      });
      return it;
    }),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}

  xFormatting = (it: string) => {
    const d = d_from(it);
    let hours: string | number = d.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes: string | number = d.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let dayMonth = '';
    const selectedPrecision = this.selectedTimelinePrecision$.getValue();
    if (selectedPrecision === 'THREE_DAYS' || selectedPrecision === 'ONE_WEEK' || selectedPrecision === 'ONE_MONTH') {
      dayMonth = `${d.getDate()}.${d.getMonth()}.`;
    }

    return `${dayMonth} ${hours}:${minutes}`;
  };
}

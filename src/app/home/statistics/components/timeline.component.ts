import {formatDate} from '@angular/common';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl} from '@angular/forms';

import {dateToBackendDateTimeString} from '@shared/services/datepicker-adapter';
import {StatisticsTimelineResponse} from '@shared/waiterrobot-backend';

import * as shape from 'd3-shape';

import {d_from, notNullAndUndefined} from 'dfts-helper';

import {BehaviorSubject, combineLatest, debounceTime, filter, map, merge, of, startWith, switchMap} from 'rxjs';
import {SelectedEventService} from '../../events/_services/selected-event.service';

type timelineType = 'PRODUCTS' | 'WAITERS' | 'PRODUCT_GROUPS';

@Component({
  template: `
    <h3>{{ 'HOME_STATISTICS_ORDER_HISTORY' | tr }}</h3>
    <div class="d-flex flex-wrap gap-2 justify-content-between align-items-end">
      @if (selectedTimelineType$ | async; as selected) {
        <div class="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'PRODUCTS'"
            (click)="selectedTimelineType$.next('PRODUCTS')"
          >
            {{ 'HOME_PROD_ALL' | tr }}
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'PRODUCT_GROUPS'"
            (click)="selectedTimelineType$.next('PRODUCT_GROUPS')"
          >
            {{ 'HOME_PROD_GROUPS' | tr }}
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'WAITERS'"
            (click)="selectedTimelineType$.next('WAITERS')"
          >
            {{ 'NAV_WAITERS' | tr }}
          </button>
        </div>
      }

      <div class="row align-items-end justify-content-end gy-2">
        <div class="form-group col-12 col-md-6 col-lg-4">
          <label for="startDate">{{ 'HOME_EVENTS_START_DATE' | tr }}</label>
          <app-datetime-input
            id="startDate"
            minuteStep="30"
            [formControl]="startDateFormControl"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | tr"
          />
        </div>

        <div class="form-group col-12 col-md-6 col-lg-4">
          <label for="endDate">{{ 'HOME_EVENTS_END_DATE' | tr }}</label>
          <app-datetime-input
            id="endDate"
            minuteStep="30"
            [formControl]="endDateFormControl"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | tr"
          />
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <select class="form-select" id="timeline-precision-select" [formControl]="selectedTimelinePrecision$">
            <option [value]="2">{{ 'HOME_STATISTICS_MINUTES_2' | tr }}</option>
            <option [value]="5">{{ 'HOME_STATISTICS_MINUTES_5' | tr }}</option>
            <option [value]="10">{{ 'HOME_STATISTICS_MINUTES_10' | tr }}</option>
            <option [value]="20">{{ 'HOME_STATISTICS_MINUTES_20' | tr }}</option>
            <option [value]="30">{{ 'HOME_STATISTICS_MINUTES_30' | tr }}</option>
            <option [value]="60">{{ 'HOME_STATISTICS_HOURS_1' | tr }}</option>
            <option [value]="180">{{ 'HOME_STATISTICS_HOURS_3' | tr }}</option>
            <option [value]="360">{{ 'HOME_STATISTICS_HOURS_6' | tr }}</option>
            <option [value]="720">{{ 'HOME_STATISTICS_HOURS_12' | tr }}</option>
          </select>
        </div>
      </div>
    </div>
    <hr />
    <div style="height: 500px">
      @if (timelineResponse$ | async; as timelineResponse) {
        @if (timelineResponse.data.length > 0) {
          <div style="height: 100%; width: 98%">
            <ngx-charts-line-chart
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [showGridLines]="true"
              [yScaleMax]="timelineResponse.highestValue"
              [xAxis]="true"
              [yAxis]="true"
              [xAxisTickFormatting]="xFormatting"
              [legend]="false"
              [xAxisLabel]="'DATE' | tr"
              [yAxisLabel]="'COUNT' | tr"
              [timeline]="true"
              [curve]="curve"
              [results]="timelineResponse.data"
            />
          </div>
        } @else {
          <h5 class="text-center my-4" style="height: 100px">{{ 'HOME_STATISTICS_NO_DATA_FOR_THIS_TIME' | tr }}</h5>
        }
      } @else {
        <div class="d-flex justify-content-center">
          <app-spinner-row />
        </div>
      }
    </div>
  `,
  selector: 'app-statistics-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  curve = shape.curveNatural;

  httpClient = inject(HttpClient);

  selectedEvent$ = inject(SelectedEventService).selectedNotNull$;
  startDateFormControl = new FormControl<string>('');
  endDateFormControl = new FormControl<string>('');

  selectedTimelinePrecision$ = new FormControl<number>(20);
  selectedTimelineType$ = new BehaviorSubject<timelineType>('PRODUCTS');

  timelineResponse$ = combineLatest([
    this.selectedEvent$,
    this.selectedTimelinePrecision$.valueChanges.pipe(
      map((it) => it ?? 20),
      startWith(20),
    ),
    this.selectedTimelineType$.asObservable(),
    merge(this.startDateFormControl.valueChanges, this.selectedEvent$.pipe(map((it) => it.startDate))).pipe(
      debounceTime(400),
      filter(notNullAndUndefined),
      filter((it) => it.length > 0),
      startWith(undefined),
    ),
    merge(this.endDateFormControl.valueChanges, this.selectedEvent$.pipe(map((it) => it.endDate))).pipe(
      debounceTime(400),
      filter(notNullAndUndefined),
      filter((it) => it.length > 0),
      startWith(undefined),
    ),
  ]).pipe(
    switchMap(([event, precision, type, startDate, endDate]) => {
      let params = new HttpParams().set('eventId', event.id);

      if (!startDate || !endDate) {
        return of({highestValue: 0, data: []});
      }

      // remove UTC timezone to make it a local time, so we can read the correct UTC time
      const startDateD = d_from(startDate.split('.')[0]);
      const endDateD = d_from(endDate.split('.')[0]);

      if (endDateD.getTime() < startDateD.getTime()) {
        console.warn('End date before start date');
        return of({highestValue: 0, data: []});
      }

      if (endDateD.getTime() - startDateD.getTime() < precision * 60000) {
        console.warn('timelinePrecision smaller than selected window');
        return of({highestValue: 0, data: []});
      }

      if (endDateD.getTime() - startDateD.getTime() > 2678400000) {
        console.warn('Selected window max not exceed 1 month');
        return of({highestValue: 0, data: []});
      }

      params = params.append('startDate', dateToBackendDateTimeString(startDateD));
      params = params.append('endDate', dateToBackendDateTimeString(endDateD));
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

  constructor() {
    this.selectedEvent$.pipe(takeUntilDestroyed()).subscribe((it) => {
      this.startDateFormControl.setValue(it.startDate ?? null);
      this.endDateFormControl.setValue(it.endDate ?? null);
    });
  }

  xFormatting = (it: string): string => {
    const d = d_from(it);
    let hours: string | number = d.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes: string | number = d.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${d.getDate()}.${d.getMonth() + 1}. ${hours}:${minutes}`;
  };
}

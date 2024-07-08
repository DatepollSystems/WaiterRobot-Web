import {formatDate} from '@angular/common';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {injectCustomFormBuilder} from '@shared/form';

import {dateToBackendDateTimeString} from '@shared/services/datepicker-adapter';
import {StatisticsTimelineResponse} from '@shared/waiterrobot-backend';

import * as shape from 'd3-shape';

import {d_from} from 'dfts-helper';
import {derivedFrom} from 'ngxtension/derived-from';
import {filterNil} from 'ngxtension/filter-nil';

import {debounceTime, filter, map, of, pipe, startWith, switchMap} from 'rxjs';
import {SelectedEventService} from '../../events/_services/selected-event.service';

type timelineType = 'PRODUCTS' | 'WAITERS' | 'PRODUCT_GROUPS';

@Component({
  template: `
    <h3>{{ 'HOME_STATISTICS_ORDER_HISTORY' | transloco }}</h3>
    <div class="d-flex flex-wrap gap-2 justify-content-between align-items-end">
      @if (selectedTimelineType(); as selected) {
        <div class="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'PRODUCTS'"
            (mousedown)="selectedTimelineType.set('PRODUCTS')"
          >
            {{ 'HOME_PROD_ALL' | transloco }}
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'PRODUCT_GROUPS'"
            (mousedown)="selectedTimelineType.set('PRODUCT_GROUPS')"
          >
            {{ 'HOME_PROD_GROUPS' | transloco }}
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            [class.active]="selected === 'WAITERS'"
            (mousedown)="selectedTimelineType.set('WAITERS')"
          >
            {{ 'NAV_WAITERS' | transloco }}
          </button>
        </div>
      }

      <form [formGroup]="form" class="row align-items-end justify-content-end gy-2">
        @if (formChange()) {}

        <div class="form-group col-12 col-md-6 col-lg-4">
          <label for="startDate">{{ 'HOME_EVENTS_START_DATE' | transloco }}</label>
          <app-datetime-input
            id="startDate"
            minuteStep="30"
            formControlName="startDate"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
          />
        </div>

        <div class="form-group col-12 col-md-6 col-lg-4">
          <label for="endDate">{{ 'HOME_EVENTS_END_DATE' | transloco }}</label>
          <app-datetime-input
            id="endDate"
            minuteStep="30"
            formControlName="endDate"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
          />
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <select class="form-select" id="timeline-precision-select" formControlName="timelinePrecision">
            <option [value]="2">{{ 'HOME_STATISTICS_MINUTES_2' | transloco }}</option>
            <option [value]="5">{{ 'HOME_STATISTICS_MINUTES_5' | transloco }}</option>
            <option [value]="10">{{ 'HOME_STATISTICS_MINUTES_10' | transloco }}</option>
            <option [value]="20">{{ 'HOME_STATISTICS_MINUTES_20' | transloco }}</option>
            <option [value]="30">{{ 'HOME_STATISTICS_MINUTES_30' | transloco }}</option>
            <option [value]="60">{{ 'HOME_STATISTICS_HOURS_1' | transloco }}</option>
            <option [value]="180">{{ 'HOME_STATISTICS_HOURS_3' | transloco }}</option>
            <option [value]="360">{{ 'HOME_STATISTICS_HOURS_6' | transloco }}</option>
            <option [value]="720">{{ 'HOME_STATISTICS_HOURS_12' | transloco }}</option>
          </select>
        </div>
      </form>
    </div>
    <hr />
    <div style="height: 500px">
      @if (timelineResponse(); as timelineResponse) {
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
              [xAxisLabel]="'DATE' | transloco"
              [yAxisLabel]="'COUNT' | transloco"
              [timeline]="true"
              [curve]="curve"
              [results]="timelineResponse.data"
            />
          </div>
        } @else {
          <h5 class="text-center my-4" style="height: 100px">{{ 'HOME_STATISTICS_NO_DATA_FOR_THIS_TIME' | transloco }}</h5>
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

  #httpClient = inject(HttpClient);

  selectedEvent = inject(SelectedEventService).selected;
  form = injectCustomFormBuilder().group({
    startDate: ['' as string | null],
    endDate: ['' as string | null],
    timelinePrecision: [20],
  });
  formChange = toSignal(this.form.valueChanges);
  selectedTimelineType = signal<timelineType>('PRODUCTS');

  timelineResponse = derivedFrom(
    [
      this.selectedEvent,
      this.selectedTimelineType,
      this.form.controls.timelinePrecision.valueChanges.pipe(startWith(20)),
      this.form.controls.startDate.valueChanges.pipe(
        debounceTime(400),
        filterNil(),
        filter((it) => it.length > 0),
        startWith(null),
      ),
      this.form.controls.endDate.valueChanges.pipe(
        debounceTime(400),
        filterNil(),
        filter((it) => it.length > 0),
        startWith(null),
      ),
    ],
    pipe(
      switchMap(([event, type, precision, startDate, endDate]) => {
        if (!startDate || !endDate || !event) {
          return of({highestValue: 0, data: []});
        }

        let params = new HttpParams().set('eventId', event.id);

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
        return this.#httpClient.get<StatisticsTimelineResponse>('/config/statistics/timeline', {params});
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
    ),
    {
      initialValue: undefined,
    },
  );

  constructor() {
    effect(
      () => {
        const it = this.selectedEvent();
        this.form.patchValue({
          startDate: it?.startDate ?? null,
          endDate: it?.endDate ?? null,
        });
      },
      {allowSignalWrites: true},
    );
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

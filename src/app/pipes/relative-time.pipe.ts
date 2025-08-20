import {DATE_PIPE_DEFAULT_OPTIONS, DatePipe, formatDate} from '@angular/common';
import {Component, LOCALE_ID, Pipe, PipeTransform, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {map, timer} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  locale = inject(LOCALE_ID);
  defaultOptions = inject(DATE_PIPE_DEFAULT_OPTIONS, {optional: true});

  transform(value: string | Date | number | undefined, currentDate = new Date(), timezone?: string, locale?: string) {
    if (!value) {
      return value;
    }

    const date = new Date(value);

    const isPastDate = currentDate.getTime() >= date.getTime();

    if (isPastDate) {
      const differenceInSec = Math.abs(currentDate.getTime() - date.getTime()) / 1000;

      if (differenceInSec < 0) {
        throw 'Difference negative, can not be!!';
      }

      if (differenceInSec < 60) {
        return 'gerade jetzt';
      }

      const differenceInMinutes = differenceInSec / 60;

      // Smaller than an hour
      if (differenceInMinutes < 60) {
        if (differenceInMinutes >= 1 && differenceInMinutes < 2) {
          return 'vor einer Minute';
        }
        return `vor ${Math.trunc(differenceInMinutes)} minuten`;
      }

      const differenceInHours = differenceInMinutes / 60;

      // Smaller than a day
      if (differenceInHours < 24) {
        if (differenceInHours >= 1 && differenceInHours < 2) {
          return 'vor einer Stunde';
        }
        return `vor ${Math.trunc(differenceInHours)} Stunden`;
      }

      const differenceInDays = differenceInHours / 24;

      if (differenceInDays <= 2) {
        return 'gestern';
      }

      if (differenceInDays <= 29) {
        return `vor ${Math.trunc(differenceInDays)} Tagen`;
      }

      const differenceInYears = differenceInDays / 29;

      return this.handleDateDifferenceBiggerThanAMonth(differenceInYears, date, timezone, locale);
    }

    const differenceInSec = Math.abs(date.getTime() - currentDate.getTime()) / 1000;

    if (differenceInSec < 0) {
      throw 'Difference negative, can not be!!';
    }

    if (differenceInSec < 60) {
      return 'gerade jetzt';
    }

    const differenceInMinutes = differenceInSec / 60;

    // Smaller than an hour
    if (differenceInMinutes < 60) {
      if (differenceInMinutes >= 1 && differenceInMinutes < 2) {
        return 'in einer Minute';
      }
      return `in ${Math.trunc(differenceInMinutes)} Minuten`;
    }

    const differenceInHours = differenceInMinutes / 60;

    // Smaller than a day
    if (differenceInHours < 24) {
      if (differenceInHours >= 1 && differenceInHours < 2) {
        return 'in einer Stunde';
      }
      return `in ${Math.trunc(differenceInHours)} Stunden`;
    }

    const differenceInDays = differenceInHours / 24;

    if (differenceInDays <= 2) {
      return 'morgen';
    }

    if (differenceInDays <= 29) {
      return `in ${Math.trunc(differenceInDays)} Tagen`;
    }

    const differenceInYears = differenceInDays / 29;

    return this.handleDateDifferenceBiggerThanAMonth(differenceInYears, date, timezone, locale);
  }

  private handleDateDifferenceBiggerThanAMonth(differenceInYears: number, date: Date, timezone?: string, locale?: string) {
    if (differenceInYears <= 12) {
      return `am ${formatDate(date, 'd MMM', locale ?? this.locale, timezone ?? this.defaultOptions?.timezone)}`;
    }

    return `am ${formatDate(date, 'd MMM yyyy', locale ?? this.locale, timezone ?? this.defaultOptions?.timezone)}`;
  }
}

@Component({
  template: `<span [ngbTooltip]="value() | date: format()">{{ value() | relativeTime: currentDate() }}</span>`,
  selector: 'wr-relative-time',
  imports: [RelativeTimePipe, NgbTooltip, DatePipe],
})
export class RelativeTimeWithTooltip {
  currentDate = toSignal(timer(0, 60000).pipe(map(() => new Date())), {initialValue: new Date()});

  value = input.required<string | Date | number | undefined>();
  format = input.required<string>();
}

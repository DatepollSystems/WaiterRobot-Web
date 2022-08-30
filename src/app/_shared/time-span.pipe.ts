import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TypeHelper} from 'dfx-helper';

@Pipe({
  name: 'timespan',
})
export class TimeSpanPipe implements PipeTransform {
  constructor() {}

  transform(first?: Date | string | null, second?: Date | string | null): string {
    if (!first || !second) {
      return '~';
    }

    if (TypeHelper.isString(first)) {
      first = new Date(first);
    }

    if (TypeHelper.isString(second)) {
      second = new Date(second);
    }
    first = first as Date;
    second = second as Date;

    const days = (first.getTime() - second.getTime()) / (1000 * 60 * 60 * 24);
    let daysRounded = Math.round(days);
    const hours = Math.abs(first.getTime() - second.getTime()) / (60 * 60 * 1000);
    let hoursRounded = Math.round(hours) - daysRounded * 24;
    const minutes = Math.round(Math.abs(first.getTime() - second.getTime()) / (60 * 1000)) - hoursRounded * 60;

    if (days < 1) {
      daysRounded = 0;
    }

    if (hours < 1) {
      hoursRounded = 0;
    }

    return `${daysRounded}d, ${hoursRounded}h, ${minutes}m`;
  }
}

@NgModule({
  imports: [],
  declarations: [TimeSpanPipe],
  exports: [TimeSpanPipe],
})
export class TimeSpanModule {}

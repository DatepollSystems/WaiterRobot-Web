import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TypeHelper} from 'dfx-helper';

@Pipe({
  name: 'timespan',
})
export class TimeSpanPipe implements PipeTransform {
  constructor() {}

  transform(dateNow?: Date | string | null, dateFuture?: Date | string | null): string {
    if (!dateNow || !dateFuture) {
      return '~';
    }

    if (TypeHelper.isString(dateNow)) {
      dateNow = new Date(dateNow);
    }

    if (TypeHelper.isString(dateFuture)) {
      dateFuture = new Date(dateFuture);
    }
    dateNow = dateNow as Date;
    dateFuture = dateFuture as Date;

    let delta = Math.abs(dateFuture.getTime() - dateNow.getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = delta % 60; // in theory the modulus is not required

    return `${days}d, ${hours}h, ${minutes}m, ${seconds.toString().split('.')[0]}s`;
  }
}

@NgModule({
  imports: [],
  declarations: [TimeSpanPipe],
  exports: [TimeSpanPipe],
})
export class TimeSpanModule {}

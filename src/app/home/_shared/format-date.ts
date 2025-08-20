import {Pipe, PipeTransform} from '@angular/core';

import {DateInput, d_from} from 'dfts-helper';

export function formatDateBeginning(date: DateInput): string {
  const d = d_from(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return [year, month, day].join('-');
}

export function d_format(date: string | number | Date): string;
export function d_format(date: null | undefined): undefined;
export function d_format(date: DateInput): string | undefined;
/**
 * Returns a string formatted in 'yyyy-MM-DD'
 * If string or date is null, returns <code>null</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function d_format(date: DateInput): string | undefined {
  return date ? formatDateBeginning(d_from(date)) : undefined;
}

export function d_formatWithHoursMinutesAndSeconds(date: string | number | Date): string;
export function d_formatWithHoursMinutesAndSeconds(date: null | undefined): undefined;
export function d_formatWithHoursMinutesAndSeconds(date: DateInput): string | undefined;
/**
 * Returns a string formatted in 'yyyy-MM-DD HH:mm:ss'
 * <br/>If string or date is null, returns <code>undefined</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function d_formatWithHoursMinutesAndSeconds(date: DateInput): string | undefined {
  if (!date) {
    return undefined;
  }

  const d = d_from(date);

  const hour = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${formatDateBeginning(d)} ${[hour, minutes, seconds].join(':')}`;
}

@Pipe({
  name: 'd_timespan',
  standalone: true,
  pure: true,
})
export class DfxTimeSpanPipe implements PipeTransform {
  transform(dateNow: DateInput, dateFuture: DateInput): string {
    return d_timespan(dateNow, dateFuture);
  }
}

/**
 * Calculates the difference between two dates in terms of days, hours, minutes, and seconds.
 * @param {DateInput} dateNow - The current date.
 * @param {DateInput} dateFuture - The future date to compare with.
 * @returns {string} A string representation of the timespan in the format "Xd, Yh, Zm, As", where X is the number
 * of days, Y is the number of hours, Z is the number of minutes, and A is the number of seconds.
 */
export const d_timespan = (dateNow: DateInput, dateFuture: DateInput): string => {
  dateNow = d_from(dateNow);
  dateFuture = d_from(dateFuture);

  const delta = Math.abs(dateFuture.getTime() - dateNow.getTime()) / 1000;

  const days = Math.floor(delta / 86400);
  const daysMultiplied = days * 86400;
  const hours = Math.floor((delta - daysMultiplied) / 3600);
  const hoursMultiplied = hours * 3600;
  const minutes = Math.floor((delta - daysMultiplied - hoursMultiplied) / 60);
  const seconds = Math.floor(delta - daysMultiplied - hoursMultiplied - minutes * 60);

  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
};

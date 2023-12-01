/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
import {Injectable} from '@angular/core';

import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {NgbDateTimeAdapter} from '../../home/_shared/components/datetime-picker/datetime-adapter';
import {NgbDateTimeStruct} from '../../home/_shared/components/datetime-picker/datetime.struct';

const DATE_DELIMITER = '-';
const TIME_DELIMITER = ':';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomDateTimeAdapter extends NgbDateTimeAdapter<string> {
  fromModel(value: string | null): NgbDateTimeStruct | null {
    if (value) {
      const dateTime = value.split('T');
      const date = dateTime[0].split(DATE_DELIMITER);
      const time = dateTime[1].split(TIME_DELIMITER);
      return {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10),
        hour: parseInt(time[0], 10),
        minute: parseInt(time[1], 10),
        second: parseInt(time[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateTimeStruct | null): string | null {
    return date ? toBackendDateTimeString(date) : null;
  }
}

export function toBackendDateTimeString(date: NgbDateTimeStruct): string {
  return `${date.year}${DATE_DELIMITER}${date.month.toString().padStart(2, '0')}${DATE_DELIMITER}${date.day
    .toString()
    .padStart(2, '0')}T${date.hour.toString().padStart(2, '0')}${TIME_DELIMITER}${date.minute
    .toString()
    .padStart(2, '0')}${TIME_DELIMITER}${date.second.toString().padStart(2, '0')}.000Z`;
}

export function dateToBackendDateTimeString(date: Date): string {
  return toBackendDateTimeString({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  });
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly SPLIT_DELIMITER = '-';
  readonly DELIMITER = '.';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date;
      if (value.includes(this.SPLIT_DELIMITER)) {
        date = value.split(this.SPLIT_DELIMITER);

        const year = parseInt(date[0], 10);
        const month = parseInt(date[1], 10);
        const day = parseInt(date[2], 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          return null;
        }

        return {
          year: year,
          month: month,
          day: day,
        };
      } else {
        date = value.split(this.DELIMITER);

        const year = parseInt(date[2], 10);
        const month = parseInt(date[1], 10);
        const day = parseInt(date[0], 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          return null;
        }

        return {
          year: year,
          month: month,
          day: day,
        };
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? `${date.day.toString().padStart(2, '0')}${this.DELIMITER}${date.month.toString().padStart(2, '0')}${this.DELIMITER}${date.year}`
      : '';
  }
}

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }
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
        return {
          year: parseInt(date[0], 10),
          month: parseInt(date[1], 10),
          day: parseInt(date[2], 10),
        };
      } else {
        date = value.split(this.DELIMITER);
        return {
          year: parseInt(date[2], 10),
          month: parseInt(date[1], 10),
          day: parseInt(date[0], 10),
        };
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

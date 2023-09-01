import {Injectable} from '@angular/core';

import {NgbDateTimeStruct} from './datetime.struct';

export function NGB_DATETIME_PICKER_ADAPTER_FACTORY(): NgbDateTimeStructAdapter {
  return new NgbDateTimeStructAdapter();
}

/**
 * An abstract service that does the conversion between the internal timepicker `NgbTimeStruct` model and
 * any provided user time model `T`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding timepicker to a form control,
 * ex. `[(ngModel)]="userTimeModel"`. Here `userTimeModel` can be of any type.
 *
 * The default timepicker implementation assumes we use `NgbTimeStruct` as a user model.
 *
 * See the [custom time adapter demo](#/components/timepicker/examples#adapter) for an example.
 *
 * @since 2.2.0
 */
@Injectable({providedIn: 'root', useFactory: NGB_DATETIME_PICKER_ADAPTER_FACTORY})
export abstract class NgbDateTimeAdapter<T> {
  /**
   * Converts a user-model time of type `T` to an `NgbDateTimeStruct` for internal use.
   */
  abstract fromModel(value: T | null): NgbDateTimeStruct | null;

  /**
   * Converts an internal `NgbDateTimeStruct` time to a user-model time of type `T`.
   */
  abstract toModel(dateTime: NgbDateTimeStruct | null): T | null;
}

@Injectable()
export class NgbDateTimeStructAdapter extends NgbDateTimeAdapter<NgbDateTimeStruct> {
  /**
   * Converts a NgbTimeStruct value into NgbTimeStruct value
   */
  fromModel(dateTime: NgbDateTimeStruct | null): NgbDateTimeStruct | null {
    return dateTime;
  }

  /**
   * Converts a NgbTimeStruct value into NgbTimeStruct value
   */
  toModel(dateTime: NgbDateTimeStruct | null): NgbDateTimeStruct | null {
    return dateTime;
  }
}

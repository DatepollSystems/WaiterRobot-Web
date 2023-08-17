import {booleanAttribute, ChangeDetectionStrategy, Component, Input, numberAttribute, Optional, Self} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {ControlValueAccessor, FormsModule, NgControl} from '@angular/forms';
import {noop} from 'rxjs';
import {
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbPopover,
  NgbTimepicker,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateTimeAdapter} from './datetime-adapter';
import {NgbDateTimeStruct} from './datetime.struct';
import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <div class="input-group">
      <input
        [id]="id"
        class="form-control bg-dark text-white"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngClass]="ngControl.valid ? 'ng-valid' : 'ng-invalid'"
        [ngModel]="displayedDateTime ?? ''"
        (ngModelChange)="onInputChange($event)"
        (blur)="inputBlur($event)"
      />

      <button
        class="btn btn-outline-light"
        [ngbPopover]="calendarContent"
        [autoClose]="'outside'"
        [placement]="'auto'"
        [disabled]="disabled"
        type="button"
      >
        <i-bs name="calendar-date" />
      </button>
    </div>

    <small *ngIf="error" class="text-warning">inkorrektes Datum</small>

    <ng-template #calendarContent>
      <div>
        <ngb-datepicker #dp name="datepicker" [(ngModel)]="dateStruct" (ngModelChange)="onDateChange($event)"></ngb-datepicker>

        <div class="d-flex justify-content-center mt-2">
          <ngb-timepicker
            [meridian]="false"
            #tp
            name="timepicker"
            [ngModel]="timeStruct"
            (ngModelChange)="onTimeChange($event)"
            [seconds]="seconds"
            [hourStep]="hourStep"
            [minuteStep]="minuteStep"
          ></ngb-timepicker>
        </div>
      </div>
    </ng-template>
  `,
  standalone: true,
  selector: 'app-datetime-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIconsModule, NgbInputDatepicker, NgbTimepicker, NgClass, NgbPopover, NgbDatepicker, NgIf, FormsModule],
})
export class AppDatetimeInputComponent implements ControlValueAccessor {
  @Input()
  placeholder: string = '';
  @Input({transform: numberAttribute})
  hourStep = 1;
  @Input({transform: numberAttribute})
  minuteStep = 1;
  @Input({transform: numberAttribute})
  secondStep = 30;
  @Input({transform: booleanAttribute})
  seconds = true;
  @Input({required: true})
  id!: string;

  error = false;
  disabled: boolean = false;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  dateStruct?: NgbDateStruct;
  timeStruct?: NgbTimeStruct;
  dateTimeStruct?: NgbDateTimeStruct;
  displayedDateTime: string | null = '';

  constructor(
    private _ngbDateParser: NgbDateParserFormatter,
    private _ngbDateTimeAdapter: NgbDateTimeAdapter<any>,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    // Setting the value accessor directly (instead of using
    // the providers) to avoid running into a circular import.
    this.ngControl.valueAccessor = this;
  }

  parse = (value: string): NgbDateTimeStruct | null => {
    const dateTimeValue = value.split(' ');
    const _dateStruct = this._ngbDateParser.parse(dateTimeValue[0]);
    const _timeStruct: string[] | undefined = dateTimeValue[1]?.split(':');

    if (!_dateStruct || !_timeStruct) {
      return null;
    }

    const hour = parseInt(_timeStruct[0], 10);
    const minute = parseInt(_timeStruct[1], 10);
    const second = this.seconds ? parseInt(_timeStruct[2], 10) : undefined;

    if (isNaN(hour) || isNaN(minute) || (this.seconds && isNaN(second ?? NaN))) {
      return null;
    }

    return {
      year: _dateStruct.year,
      month: _dateStruct.month,
      day: _dateStruct.day,
      hour: hour,
      minute: minute,
      second: second ?? 0,
    };
  };

  format = (_dateTimeStruct?: NgbDateTimeStruct): string | null =>
    _dateTimeStruct
      ? `${this._ngbDateParser.format(_dateTimeStruct)} ${_dateTimeStruct.hour.toString().padStart(2, '0')}:${_dateTimeStruct.minute
          .toString()
          .padStart(2, '0')}${this.seconds ? `:${_dateTimeStruct.second.toString().padStart(2, '0')}` : ''}`
      : '';

  formatDisplayedDateTime(): void {
    this.displayedDateTime = this.format(this.dateTimeStruct);
  }

  writeValue(value: unknown): void {
    const struct = this._ngbDateTimeAdapter.fromModel(value);
    if (struct) {
      this.dateTimeStruct = struct;
      this.dateStruct = struct;
      this.timeStruct = struct;
      this.formatDisplayedDateTime();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(input: string): void {
    const struct = this.parse(input);
    if (struct) {
      this.error = false;

      this.dateTimeStruct = struct;
      this.dateStruct = struct;
      this.timeStruct = struct;
      this.propagateModelChange();
    } else if (input.length > 0) {
      this.error = true;
    } else {
      this.error = false;
      this.onChange(null);
    }
  }

  onDateChange(event: NgbDateStruct): void {
    this.dateStruct = event;
    if (!this.dateTimeStruct) {
      this.dateTimeStruct = {
        year: event.year,
        month: event.month,
        day: event.day,
        hour: 0,
        minute: 0,
        second: 0,
      };
    } else {
      this.dateTimeStruct.year = event.year;
      this.dateTimeStruct.month = event.month;
      this.dateTimeStruct.day = event.day;
    }
    this.formatDisplayedDateTime();
    this.propagateModelChange();
  }

  onTimeChange(event: NgbTimeStruct): void {
    this.timeStruct = event;
    if (!this.dateTimeStruct) {
      const now = new Date();
      this.dateTimeStruct = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDay(),
        hour: event.hour,
        minute: event.minute,
        second: event.second,
      };
    } else {
      this.dateTimeStruct.hour = event.hour;
      this.dateTimeStruct.minute = event.minute;
      this.dateTimeStruct.second = event.second;
    }
    this.formatDisplayedDateTime();
    this.propagateModelChange();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputBlur($event: unknown): void {
    this.onTouched();
  }

  private propagateModelChange(touched = true) {
    if (touched) {
      this.onTouched();
    }
    this.onChange(this._ngbDateTimeAdapter.toModel(this.dateTimeStruct ?? null));
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

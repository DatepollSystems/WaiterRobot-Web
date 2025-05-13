import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';

import {AppDatetimeInputComponent} from '@home-shared/components/datetime-picker/datetime-picker.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';

import {BackendType} from '@shared/api';
import {injectIsValid} from '@shared/form';

@Component({
  template: `
    @if (isValid()) {}
    <form class="d-flex flex-column gap-3" #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-sm-row gap-4 gap-md-3 flex-wrap">
        <div class="form-group flex-fill">
          <label for="startDate">{{ 'HOME_EVENTS_START_DATE' | transloco }}</label>
          <app-datetime-input
            id="startDate"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
            formControlName="startDate"
            minuteStep="30"
          />
        </div>

        <div class="form-group flex-fill">
          <label for="endDate">{{ 'HOME_EVENTS_END_DATE' | transloco }}</label>
          <app-datetime-input
            id="endDate"
            [seconds]="false"
            [placeholder]="'DATETIME_PLACEHOLDER' | transloco"
            formControlName="endDate"
            minuteStep="30"
          />
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-license-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, AppDatetimeInputComponent, AppModelEditSaveBtn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLicenseEditFormComponent extends AbstractModelEditFormComponent<
  BackendType['CreateEventOrLocationDto'],
  BackendType['UpdateEventOrLocationDto']
> {
  override form = this.fb.nonNullable.group({
    startDate: new FormControl<string | null>(null),
    endDate: new FormControl<string | null>(null),
    note: ['', [Validators.minLength(0), Validators.maxLength(255)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set license(it: BackendType['GetEventOrLocationResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this.form.patchValue({
      startDate: it.startDate,
      endDate: it.endDate,
      id: it.id,
    });
  }

  @Input()
  set selectedEventId(id: number | null) {
    if (id) {
      this.lumber.log('selectedEventId', 'set selected event', id);
      this.form.controls.eventId.setValue(id);
    }
  }
}

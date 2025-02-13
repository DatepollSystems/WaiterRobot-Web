import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';

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
          <label for="reason">{{ 'HOME_BILL_UNPAID_REASON_REASON' | transloco }}</label>
          <input
            class="form-control"
            [placeholder]="'HOME_BILL_UNPAID_REASON_REASON' | transloco"
            formControlName="reason"
            name="reason"
            type="text"
          />

          @if (form.controls.reason.invalid) {
            <small class="text-danger">
              {{ 'HOME_BILL_UNPAID_REASON_REASON_INVALID' | transloco }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="description">{{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco }}</label>
          <input
            class="form-control"
            [placeholder]="'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco"
            formControlName="description"
            name="description"
            type="text"
          />

          @if (form.controls.description.invalid) {
            <small class="text-danger">
              {{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION_INVALID' | transloco }}
            </small>
          }
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-unpaid-reason-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, AppModelEditSaveBtn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUnpaidReasonEditFormComponent extends AbstractModelEditFormComponent<
  BackendType['CreateBillUnpaidReasonDto'],
  BackendType['UpdateBillUnpaidReasonDto']
> {
  override form = this.fb.nonNullable.group({
    reason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set unpaidReason(it: BackendType['GetBillUnpaidReasonResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this._unpaidReason = it;

    this.form.patchValue({
      reason: it.reason,
      description: it.description,
      id: it.id,
    });
  }
  _unpaidReason?: BackendType['GetBillUnpaidReasonResponse'];

  @Input()
  set selectedEventId(id: number | undefined) {
    if (id) {
      this.lumber.log('selectedEventId', 'set selected event', id);
      this.form.controls.eventId.setValue(id);
    }
  }
}

import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {AppDatetimeInputComponent} from '@home-shared/components/datetime-picker/datetime-picker.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';

import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectIsValid} from '@shared/form';
import {CreateBillUnpaidReasonDto, GetBillUnpaidReasonResponse, UpdateBillUnpaidReasonDto} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-sm-row gap-4 gap-md-3 flex-wrap">
        <div class="form-group flex-fill">
          <label for="reason">{{ 'HOME_BILL_UNPAID_REASON_REASON' | transloco }}</label>
          <input
            class="form-control"
            formControlName="reason"
            name="reason"
            type="text"
            [placeholder]="'HOME_BILL_UNPAID_REASON_REASON' | transloco"
          />

          @if (form.controls.reason.invalid) {
            <small class="text-danger"> {{ 'HOME_BILL_UNPAID_REASON_REASON_INVALID' | transloco }} </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="description">{{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco }}</label>
          <input
            class="form-control"
            formControlName="description"
            name="description"
            type="text"
            [placeholder]="'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco"
          />

          @if (form.controls.description.invalid) {
            <small class="text-danger"> {{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION_INVALID' | transloco }} </small>
          }
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-unpaid-reason-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, BiComponent, NgbInputDatepicker, AppDatetimeInputComponent, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUnpaidReasonEditFormComponent extends AbstractModelEditFormComponent<CreateBillUnpaidReasonDto, UpdateBillUnpaidReasonDto> {
  override form = this.fb.nonNullable.group({
    reason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set unpaidReason(it: GetBillUnpaidReasonResponse | 'CREATE') {
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
  _unpaidReason?: GetBillUnpaidReasonResponse;

  @Input()
  set selectedEventId(id: number | undefined) {
    if (id) {
      this.lumber.log('selectedEventId', 'set selected event', id);
      this.form.controls.eventId.setValue(id);
    }
  }
}

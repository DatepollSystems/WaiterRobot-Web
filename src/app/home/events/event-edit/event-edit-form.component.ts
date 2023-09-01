import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateEventOrLocationDto, GetEventOrLocationResponse, UpdateEventOrLocationDto} from '../../../_shared/waiterrobot-backend';
import {AppDatetimeInputComponent} from '../../../_shared/ui/datetime-picker/datetime-picker.component';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row mb-3">
        <div class="form-group col-12 col-md-4 col-xl-6">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" formControlName="name" name="name" type="text" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger"> {{ 'HOME_ORGS_NAME_INCORRECT' | tr }} </small>
        </div>

        <div class="form-group col-12 col-md-4 col-xl-3">
          <label for="startDate">{{ 'HOME_EVENTS_START_DATE' | tr }}</label>
          <app-datetime-input
            id="startDate"
            formControlName="startDate"
            minuteStep="30"
            [seconds]="false"
            placeholder="{{ 'DATETIME_PLACEHOLDER' | tr }}"
          />
        </div>

        <div class="form-group col-12 col-md-4 col-xl-3">
          <label for="endDate">{{ 'HOME_EVENTS_END_DATE' | tr }}</label>
          <app-datetime-input
            id="endDate"
            formControlName="endDate"
            minuteStep="30"
            [seconds]="false"
            placeholder="{{ 'DATETIME_PLACEHOLDER' | tr }}"
          />
        </div>
      </div>

      <div class="row">
        <div class="form-group col-12 col-md-7 col-xl-4">
          <label for="street">{{ 'HOME_ORGS_STREET' | tr }}</label>
          <input
            formControlName="street"
            class="form-control bg-dark text-white"
            type="text"
            id="street"
            placeholder="{{ 'HOME_ORGS_STREET' | tr }}"
          />
          <small *ngIf="form.controls.street.invalid" class="text-danger"> {{ 'HOME_ORGS_STREET_INCORRECT' | tr }} </small>
        </div>
        <div class="form-group col-12 col-md-4 col-xl-2">
          <label for="streetNumber">{{ 'HOME_ORGS_STREETNUMBER' | tr }}</label>
          <input
            formControlName="streetNumber"
            class="form-control bg-dark text-white"
            type="text"
            id="streetNumber"
            placeholder="{{ 'HOME_ORGS_STREETNUMBER' | tr }}"
          />
          <small *ngIf="form.controls.streetNumber.invalid" class="text-danger"> {{ 'HOME_ORGS_STREETNUMBER_INCORRECT' | tr }} </small>
        </div>

        <div class="form-group col-12 col-md-4 col-xl-2">
          <label for="postalCode">{{ 'HOME_ORGS_POSTAL_CODE' | tr }}</label>
          <input
            formControlName="postalCode"
            class="form-control bg-dark text-white"
            type="text"
            id="postalCode"
            placeholder="{{ 'HOME_ORGS_POSTAL_CODE' | tr }}"
          />
          <small *ngIf="form.controls.postalCode.invalid" class="text-danger"> {{ 'HOME_ORGS_POSTAL_CODE_INCORRECT' | tr }} </small>
        </div>

        <div class="form-group col-12 col-md-7 col-xl-4">
          <label for="city">{{ 'HOME_ORGS_CITY' | tr }}</label>
          <input
            formControlName="city"
            class="form-control bg-dark text-white"
            type="text"
            id="city"
            placeholder="{{ 'HOME_ORGS_CITY' | tr }}"
          />
          <small *ngIf="form.controls.city.invalid" class="text-danger"> {{ 'HOME_ORGS_CITY_INCORRECT' | tr }} </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 gap-md-4 mt-2">
        <div class="form-check" *ngIf="_isEdit">
          <input class="form-check-input" type="checkbox" id="updateWaiterCreateToken" formControlName="updateWaiterCreateToken" />
          <label class="form-check-label" for="updateWaiterCreateToken"> {{ 'HOME_EVENTS_UPDATE_CREATE_WAITER_TOKEN' | tr }} </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-event-edit-form',
  imports: [ReactiveFormsModule, DfxTr, AppIconsModule, NgbInputDatepicker, NgIf, AsyncPipe, AppDatetimeInputComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEventEditFormComponent extends AbstractModelEditFormComponent<CreateEventOrLocationDto, UpdateEventOrLocationDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    startDate: new FormControl<string | null>(null),
    endDate: new FormControl<string | null>(null),
    street: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
    streetNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    postalCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
    city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    updateWaiterCreateToken: [false, [Validators.required]],
    organisationId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  @Input()
  set event(it: GetEventOrLocationResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this._event = it;

    this.form.patchValue({
      name: it.name,
      startDate: it.startDate,
      endDate: it.endDate,
      street: it.street,
      streetNumber: it.streetNumber,
      postalCode: it.postalCode,
      city: it.city,
      id: it.id,
    });
  }
  _event?: GetEventOrLocationResponse;

  @Input()
  set selectedOrganisationId(id: number | undefined) {
    if (id) {
      this.lumber.log('selectedOrganisation', 'set selected org', id);
      this.form.controls.organisationId.setValue(id);
    }
  }
}

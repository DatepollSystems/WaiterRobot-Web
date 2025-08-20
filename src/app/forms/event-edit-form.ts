import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';

import {APIType} from '../api';
import {AppDatetimeInputComponent} from '../components/datetime-picker/datetime-picker.component';
import {injectIsValid} from '../util/form';
import {AbstractModelEditFormComponent} from './form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from './form/app-model-edit-save-btn.component';

@Component({
  template: `
    @if (isValid()) {}

    <form class="d-flex flex-column gap-3" #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-sm-row gap-4 gap-md-3 flex-wrap">
        <div class="form-group flex-fill">
          <label for="name">{{ 'NAME' | transloco }}</label>
          <input class="form-control" [placeholder]="'NAME' | transloco" formControlName="name" name="name" type="text" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_ORGS_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>

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

      <div class="d-flex flex-column flex-md-row gap-4 gap-md-3 flex-wrap">
        <div class="form-group flex-fill">
          <label for="street">{{ 'HOME_ORGS_STREET' | transloco }}</label>
          <input class="form-control" id="street" [placeholder]="'HOME_ORGS_STREET' | transloco" formControlName="street" type="text" />
          @if (form.controls.street.invalid) {
            <small class="text-danger">
              {{ 'HOME_ORGS_STREET_INCORRECT' | transloco }}
            </small>
          }
        </div>
        <div class="form-group flex-fill">
          <label for="streetNumber">{{ 'HOME_ORGS_STREETNUMBER' | transloco }}</label>
          <input
            class="form-control"
            id="streetNumber"
            [placeholder]="'HOME_ORGS_STREETNUMBER' | transloco"
            formControlName="streetNumber"
            type="text"
          />
          @if (form.controls.streetNumber.invalid) {
            <small class="text-danger">
              {{ 'HOME_ORGS_STREETNUMBER_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="postalCode">{{ 'HOME_ORGS_POSTAL_CODE' | transloco }}</label>
          <input
            class="form-control"
            id="postalCode"
            [placeholder]="'HOME_ORGS_POSTAL_CODE' | transloco"
            formControlName="postalCode"
            type="text"
          />
          @if (form.controls.postalCode.invalid) {
            <small class="text-danger">
              {{ 'HOME_ORGS_POSTAL_CODE_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="city">{{ 'HOME_ORGS_CITY' | transloco }}</label>
          <input class="form-control" id="city" [placeholder]="'HOME_ORGS_CITY' | transloco" formControlName="city" type="text" />
          @if (form.controls.city.invalid) {
            <small class="text-danger">
              {{ 'HOME_ORGS_CITY_INCORRECT' | transloco }}
            </small>
          }
        </div>
      </div>

      @if (!isCreating()) {
        <div class="d-flex flex-column flex-md-row justify-content-between gap-2 gap-md-4 mt-2">
          <div class="form-check">
            <input class="form-check-input" id="updateWaiterCreateToken" type="checkbox" formControlName="updateWaiterCreateToken" />
            <label class="form-check-label" for="updateWaiterCreateToken">
              {{ 'HOME_EVENTS_UPDATE_CREATE_WAITER_TOKEN' | transloco }}
            </label>
          </div>
        </div>
      }

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'event-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, AppDatetimeInputComponent, AppModelEditSaveBtn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditForm extends AbstractModelEditFormComponent<
  APIType['CreateEventOrLocationDto'],
  APIType['UpdateEventOrLocationDto']
> {
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

  isValid = injectIsValid(this.form);

  @Input()
  set event(it: APIType['GetEventOrLocationResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

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

  @Input()
  set selectedOrganisationId(id: number | null) {
    if (id) {
      this.lumber.log('selectedOrganisation', 'set selected org', id);
      this.form.controls.organisationId.setValue(id);
    }
  }
}

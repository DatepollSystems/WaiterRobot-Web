import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';

import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {injectIsValid} from '@shared/form';
import {CreateOrganisationDto, GetOrganisationResponse, UpdateOrganisationDto} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-sm-row gap-3 gap-md-4">
        <div class="form-group flex-fill">
          <label for="name">{{ 'NAME' | transloco }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" [placeholder]="'NAME' | transloco" />

          @if (form.controls.name.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_NAME_INCORRECT' | transloco }} </small>
          }
        </div>
        <div class="form-group">
          <label for="countryCode">{{ 'HOME_ORGS_COUNTRY_CODE' | transloco }}</label>
          <input
            class="form-control"
            type="text"
            id="countryCode"
            formControlName="countryCode"
            [placeholder]="'HOME_ORGS_COUNTRY_CODE' | transloco"
          />
          @if (form.controls.countryCode.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_COUNTRY_CODE_INCORRECT' | transloco }} </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row gap-4">
        <div class="form-group flex-fill">
          <label for="street">{{ 'HOME_ORGS_STREET' | transloco }}</label>
          <input class="form-control" type="text" id="street" formControlName="street" [placeholder]="'HOME_ORGS_STREET' | transloco" />
          @if (form.controls.street.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_STREET_INCORRECT' | transloco }} </small>
          }
        </div>
        <div class="form-group flex-fill">
          <label for="streetNumber">{{ 'HOME_ORGS_STREETNUMBER' | transloco }}</label>
          <input
            class="form-control"
            type="text"
            id="streetNumber"
            formControlName="streetNumber"
            [placeholder]="'HOME_ORGS_STREETNUMBER' | transloco"
          />
          @if (form.controls.streetNumber.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_STREETNUMBER_INCORRECT' | transloco }} </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="postalCode">{{ 'HOME_ORGS_POSTAL_CODE' | transloco }}</label>
          <input
            class="form-control"
            type="text"
            id="postalCode"
            formControlName="postalCode"
            [placeholder]="'HOME_ORGS_POSTAL_CODE' | transloco"
          />
          @if (form.controls.postalCode.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_POSTAL_CODE_INCORRECT' | transloco }} </small>
          }
        </div>

        <div class="form-group flex-fill">
          <label for="city">{{ 'HOME_ORGS_CITY' | transloco }}</label>
          <input class="form-control" type="text" id="city" formControlName="city" [placeholder]="'HOME_ORGS_CITY' | transloco" />
          @if (form.controls.city.invalid) {
            <small class="text-danger"> {{ 'HOME_ORGS_CITY_INCORRECT' | transloco }} </small>
          }
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-organisation-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, BiComponent, NgbInputDatepicker, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrganisationEditFormComponent extends AbstractModelEditFormComponent<CreateOrganisationDto, UpdateOrganisationDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    street: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
    streetNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    postalCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
    city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  @Input()
  set organisation(it: GetOrganisationResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this._organisation = it;

    this.form.patchValue({
      name: it.name,
      street: it.street,
      streetNumber: it.streetNumber,
      postalCode: it.postalCode,
      city: it.city,
      countryCode: it.countryCode,
      id: it.id,
    });
  }

  _organisation?: GetOrganisationResponse;
}

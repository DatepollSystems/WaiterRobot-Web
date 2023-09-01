import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateOrganisationDto, GetOrganisationResponse, UpdateOrganisationDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-3">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control bg-dark text-white" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          <small *ngIf="form.controls.name.invalid" class="text-danger"> {{ 'HOME_ORGS_NAME_INCORRECT' | tr }} </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between gap-4 mb-3">
        <div class="form-group col-12 col-md-7">
          <label for="street">{{ 'HOME_ORGS_STREET' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="street"
            formControlName="street"
            placeholder="{{ 'HOME_ORGS_STREET' | tr }}"
          />
          <small *ngIf="form.controls.street.invalid" class="text-danger"> {{ 'HOME_ORGS_STREET_INCORRECT' | tr }} </small>
        </div>
        <div class="form-group col-12 col-md-4">
          <label for="streetNumber">{{ 'HOME_ORGS_STREETNUMBER' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="streetNumber"
            formControlName="streetNumber"
            placeholder="{{ 'HOME_ORGS_STREETNUMBER' | tr }}"
          />
          <small *ngIf="form.controls.streetNumber.invalid" class="text-danger"> {{ 'HOME_ORGS_STREETNUMBER_INCORRECT' | tr }} </small>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between gap-4 mb-3">
        <div class="form-group col-12 col-md-3">
          <label for="postalCode">{{ 'HOME_ORGS_POSTAL_CODE' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="postalCode"
            formControlName="postalCode"
            placeholder="{{ 'HOME_ORGS_POSTAL_CODE' | tr }}"
          />
          <small *ngIf="form.controls.postalCode.invalid" class="text-danger"> {{ 'HOME_ORGS_POSTAL_CODE_INCORRECT' | tr }} </small>
        </div>

        <div class="form-group col-12 col-md-6">
          <label for="city">{{ 'HOME_ORGS_CITY' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="city"
            formControlName="city"
            placeholder="{{ 'HOME_ORGS_CITY' | tr }}"
          />
          <small *ngIf="form.controls.city.invalid" class="text-danger"> {{ 'HOME_ORGS_CITY_INCORRECT' | tr }} </small>
        </div>

        <div class="form-group col-12 col-md-2">
          <label for="countryCode">{{ 'HOME_ORGS_COUNTRY_CODE' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="countryCode"
            formControlName="countryCode"
            placeholder="{{ 'HOME_ORGS_COUNTRY_CODE' | tr }}"
          />
          <small *ngIf="form.controls.countryCode.invalid" class="text-danger"> {{ 'HOME_ORGS_COUNTRY_CODE_INCORRECT' | tr }} </small>
        </div>
      </div>
    </form>
  `,
  selector: 'app-organisation-edit-form',
  imports: [ReactiveFormsModule, DfxTr, AppIconsModule, NgbInputDatepicker, NgIf, AsyncPipe],
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

  @Input()
  set organisation(it: GetOrganisationResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
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

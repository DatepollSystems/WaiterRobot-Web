import {ChangeDetectionStrategy, Component, Input, inject, input, output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgSelectModule} from '@ng-select/ng-select';

import {APIType} from '../api';
import {injectIsValid} from '../util/form';
import {AbstractModelEditFormComponent} from './form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from './form/app-model-edit-save-btn.component';

@Component({
  template: `
    @if (isValid()) {}

    <form class="d-flex flex-column gap-3" #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="email">{{ 'EMAIL' | transloco }}</label>
          <input class="form-control" id="email" [placeholder]="'EMAIL' | transloco" type="email" formControlName="emailAddress" />

          @if (form.controls.emailAddress.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_EMAIL_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="firstname">{{ 'FIRSTNAME' | transloco }}</label>
          <input class="form-control" id="firstname" [placeholder]="'FIRSTNAME' | transloco" type="text" formControlName="firstname" />

          @if (form.controls.firstname.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="surname">{{ 'SURNAME' | transloco }}</label>
          <input class="form-control" id="surname" [placeholder]="'SURNAME' | transloco" type="text" formControlName="surname" />
          @if (form.controls.surname.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_SUR_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>
      </div>

      <div class="row gy-2">
        <div class="col col-md-6">
          <div class="form-group mb-2">
            <label for="password">{{ 'PASSWORD' | transloco }}</label>
            <input class="form-control" id="password" type="password" formControlName="password" placeholder="*******" />

            @if (form.controls.password.invalid) {
              <small class="text-danger">
                {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }}
              </small>
            }
          </div>

          @if (!isCreating()) {
            <div class="form-check form-switch mt-2">
              <input class="form-check-input" id="updatePassword" type="checkbox" role="switch" formControlName="updatePassword" />
              <label class="form-check-label" for="updatePassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD' | transloco }}</label>
            </div>
          }
        </div>

        @if (!isCreating()) {
          <div class="form-group col">
            <label for="orgSelect">{{ 'NAV_ORGANISATIONS' | transloco }}</label>
            <ng-select
              [items]="organisations()"
              [multiple]="true"
              [placeholder]="'HOME_USERS_ORGS_INPUT_PLACEHOLDER' | transloco"
              (change)="userOrganisations.emit($event)"
              bindLabel="name"
              bindValue="id"
              labelForId="orgSelect"
              clearAllText="Clear"
              formControlName="selectedOrganisations"
            />
          </div>
        }
      </div>

      <div class="form-check">
        <input class="form-check-input" id="sendInvitation" type="checkbox" formControlName="sendInvitation" />
        <label class="form-check-label" for="sendInvitation">
          {{ 'HOME_USERS_SEND_INVITE' | transloco }}
        </label>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
        <div class="form-check form-switch">
          <input class="form-check-input" id="isAdmin" type="checkbox" formControlName="isAdmin" />
          <label class="form-check-label" for="isAdmin">
            {{ 'HOME_USERS_ADMIN' | transloco }}
          </label>
        </div>

        @if (!isCreating()) {
          <div class="form-check form-switch">
            <input class="form-check-input" id="activated" type="checkbox" formControlName="activated" />
            <label class="form-check-label" for="activated">
              {{ 'HOME_USERS_ACTIVATED' | transloco }}
            </label>
          </div>
        }

        <div class="form-check form-switch">
          <input class="form-check-input" id="forcePasswordChange" type="checkbox" formControlName="forcePasswordChange" />
          <label class="form-check-label" for="forcePasswordChange">
            {{ 'HOME_USERS_FORCE_PASSWORD_CHANGE' | transloco }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'user-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, AppModelEditSaveBtn, NgSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditForm extends AbstractModelEditFormComponent<APIType['CreateUserDto'], APIType['UpdateUserDto']> {
  readonly userOrganisations = output<[]>();

  form = inject(FormBuilder).nonNullable.group({
    emailAddress: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255), Validators.email]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
    surname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
    password: ['', [Validators.minLength(6)]],
    updatePassword: [false],
    isAdmin: [false, [Validators.required]],
    activated: [true, [Validators.required]],
    sendInvitation: [false, [Validators.required]],
    forcePasswordChange: [false, [Validators.required]],
    selectedOrganisations: [new Array<number>()],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    // @ts-expect-error role does not exist
    value.role = value.isAdmin ? 'ADMIN' : 'USER';
    if ((value.updatePassword === false || value.updatePassword === undefined) && !this.isCreating()) {
      value.password = undefined;
    }

    if (value.password === '') {
      value.password = undefined;
    }

    return super.overrideRawValue(value);
  };

  override reset(): void {
    super.reset();

    this.form.controls.password.enable();
  }

  lastForcePasswordChangeValue?: boolean;
  lastActivatedValue?: boolean;

  constructor() {
    super();

    this.form.controls.updatePassword.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value) {
        this.form.controls.password.enable();
      } else {
        this.form.controls.password.disable();
      }
    });

    this.form.controls.sendInvitation.valueChanges.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        this.lastForcePasswordChangeValue = this.form.controls.forcePasswordChange.getRawValue();
        this.form.controls.forcePasswordChange.disable();
        this.form.controls.forcePasswordChange.setValue(true);
        this.lastActivatedValue = this.form.controls.activated.getRawValue();
        this.form.controls.activated.disable();
        this.form.controls.activated.setValue(true);
        return;
      }

      this.form.controls.forcePasswordChange.setValue(this.lastForcePasswordChangeValue!);
      this.form.controls.forcePasswordChange.enable();
      this.form.controls.activated.setValue(this.lastActivatedValue!);
      this.form.controls.activated.enable();
    });
  }

  @Input()
  set user(it: APIType['GetUserResponse'] | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      this.form.controls.password.setValidators([Validators.minLength(6)]);
      return;
    }

    this.form.controls.password.disable();
    this.form.patchValue({
      id: it.id,
      emailAddress: it.emailAddress,
      firstname: it.firstname,
      surname: it.surname,
      isAdmin: it.role === 'ADMIN',
      activated: it.activated,
      forcePasswordChange: it.forcePasswordChange,
    });
  }

  organisations = input<APIType['GetOrganisationResponse'][]>([]);
  @Input() set selectedOrganisations(selectedOrganisations: APIType['IdAndNameResponse'][]) {
    this.form.controls.selectedOrganisations.setValue(selectedOrganisations.map((it) => it.id));
  }
}

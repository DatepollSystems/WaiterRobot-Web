import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {CreateUserDto, GetUserResponse, UpdateUserDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="email">{{ 'EMAIL' | tr }}</label>
          <input class="form-control" type="email" id="email" formControlName="emailAddress" placeholder="{{ 'EMAIL' | tr }}" />

          <small *ngIf="form.controls.emailAddress.invalid" class="text-danger">
            {{ 'HOME_USERS_EMAIL_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="firstname">{{ 'FIRSTNAME' | tr }}</label>
          <input class="form-control" type="text" id="firstname" formControlName="firstname" placeholder="{{ 'FIRSTNAME' | tr }}" />

          <small *ngIf="form.controls.firstname.invalid" class="text-danger">
            {{ 'HOME_USERS_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="surname">{{ 'SURNAME' | tr }}</label>
          <input class="form-control" type="text" id="surname" formControlName="surname" placeholder="{{ 'SURNAME' | tr }}" />
          <small *ngIf="form.controls.surname.invalid" class="text-danger">
            {{ 'HOME_USERS_SUR_NAME_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="row gy-2 mt-1">
        <div class="col col-md-6">
          <div class="form-group mb-2">
            <label for="password">{{ 'PASSWORD' | tr }}</label>
            <input class="form-control" type="password" id="password" formControlName="password" placeholder="*******" />

            <small *ngIf="form.controls.password.invalid" class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
            </small>
          </div>

          <div class="form-check form-switch mt-2" *ngIf="_isEdit">
            <input class="form-check-input" type="checkbox" role="switch" id="updatePassword" formControlName="updatePassword" />
            <label class="form-check-label" for="updatePassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD' | tr }}</label>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="isAdmin" formControlName="isAdmin" />
          <label class="form-check-label" for="isAdmin">
            {{ 'HOME_USERS_ADMIN' | tr }}
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="sendInvitation" formControlName="sendInvitation" />
          <label class="form-check-label" for="sendInvitation">
            {{ 'HOME_USERS_SEND_INVITE' | tr }}
          </label>
        </div>

        <div class="form-check" *ngIf="_isEdit">
          <input class="form-check-input" type="checkbox" id="activated" formControlName="activated" />
          <label class="form-check-label" for="activated">
            {{ 'HOME_USERS_ACTIVATED' | tr }}
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="forcePasswordChange" formControlName="forcePasswordChange" />
          <label class="form-check-label" for="forcePasswordChange">
            {{ 'HOME_USERS_FORCE_PASSWORD_CHANGE' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DfxTr, BiComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent extends AbstractModelEditFormComponent<CreateUserDto, UpdateUserDto> {
  override form = this.fb.nonNullable.group({
    emailAddress: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255), Validators.email]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
    surname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
    password: ['', [Validators.minLength(6)]],
    updatePassword: [false],
    isAdmin: [false, [Validators.required]],
    activated: [true, [Validators.required]],
    sendInvitation: [false, [Validators.required]],
    forcePasswordChange: [false, [Validators.required]],
    id: [-1],
  });

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    // @ts-ignore
    value.role = value.isAdmin ? 'ADMIN' : 'USER';
    if ((value.updatePassword === false || value.updatePassword === undefined) && this._isEdit) {
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

    this.unsubscribe(
      this.form.controls.updatePassword.valueChanges.subscribe((value) =>
        value ? this.form.controls.password.enable() : this.form.controls.password.disable(),
      ),
      this.form.controls.sendInvitation.valueChanges.subscribe((it) => {
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
      }),
    );
  }

  @Input()
  set user(it: GetUserResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
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
}

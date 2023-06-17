import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateUserDto, GetUserResponse, UpdateUserDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="email">{{ 'EMAIL' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="email"
            id="email"
            formControlName="emailAddress"
            placeholder="{{ 'EMAIL' | tr }}"
          />

          <small *ngIf="form.controls.emailAddress.invalid" class="text-danger">
            {{ 'HOME_USERS_EMAIL_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="firstname">{{ 'FIRSTNAME' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="firstname"
            formControlName="firstname"
            placeholder="{{ 'FIRSTNAME' | tr }}"
          />

          <small *ngIf="form.controls.firstname.invalid" class="text-danger">
            {{ 'HOME_USERS_NAME_INCORRECT' | tr }}
          </small>
        </div>

        <div class="form-group col-sm">
          <label for="surname">{{ 'SURNAME' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="text"
            id="surname"
            formControlName="surname"
            placeholder="{{ 'SURNAME' | tr }}"
          />
          <small *ngIf="form.controls.surname.invalid" class="text-danger">
            {{ 'HOME_USERS_SUR_NAME_INCORRECT' | tr }}
          </small>
        </div>
      </div>

      <div class="row gy-2 mt-1">
        <div class="form-group col-sm">
          <label for="birthday">{{ 'HOME_USERS_BIRTHDAY' | tr }}</label>
          <div class="input-group">
            <input
              type="text"
              ngbDatepicker
              class="form-control bg-dark text-white"
              id="birthday"
              #birthdayPicker="ngbDatepicker"
              name="birthday"
              placeholder="09.12.2021"
              formControlName="birthday"
            />
            <button class="btn btn-outline-light" (click)="birthdayPicker.toggle()" type="button">
              <i-bs name="calendar-date" />
            </button>
          </div>

          <small *ngIf="form.controls.birthday.invalid" class="text-danger">
            {{ 'HOME_USERS_BIRTHDAY_INCORRECT' | tr }}
          </small>
        </div>

        <div class="col">
          <div class="form-group mb-2">
            <label for="password">{{ 'PASSWORD' | tr }}</label>
            <input class="form-control bg-dark text-white" type="password" id="password" formControlName="password" placeholder="*******" />

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
          <input class="form-check-input" type="checkbox" id="activated" formControlName="activated" />
          <label class="form-check-label" for="activated">
            {{ 'HOME_USERS_ACTIVATED' | tr }}
          </label>
        </div>

        <div class="form-check" *ngIf="_isEdit">
          <input class="form-check-input" type="checkbox" id="forcePasswordChange" formControlName="forcePasswordChange" />
          <label class="form-check-label" for="forcePasswordChange">
            {{ 'HOME_USERS_FORCE_PASSWORD_CHANGE' | tr }}
          </label>
        </div>
      </div>
    </form>
  `,
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DfxTr, AppIconsModule, NgbInputDatepicker],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent extends AbstractModelEditFormComponent<CreateUserDto, UpdateUserDto> {
  override form = this.fb.nonNullable.group({
    emailAddress: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255), Validators.email]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
    surname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
    birthday: ['', [Validators.required]],
    password: ['', [Validators.minLength(6)]],
    updatePassword: [false],
    isAdmin: [false, [Validators.required]],
    activated: [false, [Validators.required]],
    forcePasswordChange: [false, [Validators.required]],
    id: [-1],
  });

  override overrideRawValue = (value: typeof this.form.value): any => {
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

  constructor() {
    super();

    this.unsubscribe(
      this.form.controls.updatePassword.valueChanges.subscribe((value) =>
        value ? this.form.controls.password.enable() : this.form.controls.password.disable()
      )
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
      birthday: it.birthday,
      isAdmin: it.role === 'ADMIN',
      activated: it.activated,
    });
  }
}

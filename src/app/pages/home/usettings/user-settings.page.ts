import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {s_isEmail} from 'dfts-helper';

import {AuthService} from '@shared/services';

import {NotificationService} from '../../services/notification.service';
import {MyUserService} from '../../services/user/my-user.service';
import {UserSettingsService} from './_services/user-settings.service';

@Component({
  template: `
    <div class="d-flex flex-column">
      <h1>{{ 'NAV_USER_SETTINGS' | transloco }}</h1>

      <div class="card mb-3">
        <div class="card-body">
          <h4 class="card-title">{{ 'HOME_USERSETTINGS_USER_SETTINGS_EMAIL' | transloco }}</h4>
          <h6 class="card-subtitle mb-2">{{ 'HOME_USERSETTINGS_USER_SETTINGS_EMAIL_SUBTITLE' | transloco }}</h6>
          <form #emailForm="ngForm" (ngSubmit)="changeEmail(emailForm)">
            <div class="d-flex flex-column card-text mb-3">
              <div>
                <div class="form-group col-12 col-md-3">
                  <label for="email">{{ 'EMAIL' | transloco }}</label>
                  <input
                    class="form-control mb-1"
                    id="email"
                    #emailModel="ngModel"
                    [ngModel]="emailAddress()"
                    (ngModelChange)="emailChange($event)"
                    type="email"
                    name="email"
                  />
                  @if (emailModel.invalid || !emailAddressValid()) {
                    <small class="text-danger"> {{ 'HOME_USERS_EMAIL_INCORRECT' | transloco }} </small>
                  }
                </div>
              </div>
            </div>
            <button class="btn btn-outline-warning" [disabled]="!emailForm || !emailForm.valid || !emailAddressValid" type="submit">
              {{ 'SAVE' | transloco }}
            </button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h4 class="card-title">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD' | transloco }}</h4>
          <form #passwordForm="ngForm" (ngSubmit)="changePassword(passwordForm)">
            <div class="d-flex flex-column card-text mb-3">
              <div>
                <div class="form-group col-12 col-md-4">
                  <label for="oldPassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_OLD' | transloco }}</label>
                  <input
                    class="form-control mb-1"
                    id="oldPassword"
                    #passwordModel="ngModel"
                    [minlength]="6"
                    [placeholder]="'PASSWORD' | transloco"
                    ngModel
                    type="password"
                    required
                    name="oldPassword"
                  />
                  @if (passwordModel.invalid) {
                    <small class="text-danger"> {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }} </small>
                  }
                </div>
              </div>

              <div>
                <div class="form-group col-12 col-md-4">
                  <label for="newPassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW' | transloco }}</label>
                  <input
                    class="form-control mb-1"
                    id="newPassword"
                    #newPasswordModel="ngModel"
                    [minlength]="6"
                    [placeholder]="'PASSWORD' | transloco"
                    (ngModelChange)="newPasswordsChange($event, undefined)"
                    ngModel
                    type="password"
                    required
                    name="newPassword"
                  />
                  @if (newPasswordModel.invalid) {
                    <small class="text-danger"> {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }} </small>
                  }
                </div>
              </div>

              <div>
                <div class="form-group col-12 col-md-4">
                  <label for="newPasswordAgain">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_AGAIN' | transloco }}</label>
                  <input
                    class="form-control mb-1"
                    id="newPasswordAgain"
                    #newPasswordAgainModel="ngModel"
                    [minlength]="6"
                    [placeholder]="'PASSWORD' | transloco"
                    (ngModelChange)="newPasswordsChange(undefined, $event)"
                    ngModel
                    type="password"
                    required
                    name="newPasswordAgain"
                  />

                  @if (newPasswordAgainModel.invalid) {
                    <div>
                      <small class="text-danger"> {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }} </small>
                    </div>
                  }
                  @if (!newPasswordsMatch) {
                    <div>
                      <small class="text-danger"> {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | transloco }} </small>
                    </div>
                  }
                </div>
              </div>
            </div>
            <button class="btn btn-outline-danger" [disabled]="!passwordForm || !passwordForm.valid || !newPasswordsMatch" type="submit">
              {{ 'SAVE' | transloco }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  selector: 'app-user-settings-sub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoPipe],
})
export class UserSettingsPage {
  #authService = inject(AuthService);
  #myUserService = inject(MyUserService);
  #notificationService = inject(NotificationService);
  #userSettingsService = inject(UserSettingsService);

  newPasswordsMatch = false;
  newPassword = '';
  newPasswordAgain = '';

  emailAddressValid = signal(true);

  emailAddress = computed(() => this.#myUserService.user()?.emailAddress);

  emailChange(email: string): void {
    this.emailAddressValid.set(s_isEmail(email));
  }

  changeEmail(form: NgForm): void {
    this.#userSettingsService.changeEmail({emailAddress: form.form.value.email as string}).subscribe(() => {
      this.#notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_EMAIL_SUCCESS');

      setTimeout(() => {
        this.#authService.logout();
      }, 5000);
    });
  }

  newPasswordsChange(password: string | undefined, passwordAgain: string | undefined): void {
    if (password) {
      this.newPassword = password;
    }
    if (passwordAgain) {
      this.newPasswordAgain = passwordAgain;
    }
    if (this.newPassword.trim().length > 0 && this.newPasswordAgain.trim().length > 0) {
      this.newPasswordsMatch = this.newPassword === this.newPasswordAgain;
      if (this.newPasswordsMatch) {
        if (this.newPassword.toLowerCase() === 'do the barrel roll') {
          document.getElementById('body')?.classList.add('roll');
          window.setTimeout(() => {
            document.getElementById('body')?.classList.remove('roll');
          }, 4100);
        }
      }
    }
  }

  changePassword(form: NgForm): void {
    this.#userSettingsService
      .changePassword({
        oldPassword: form.form.value.oldPassword as string,
        newPassword: form.form.value.newPassword as string,
      })
      .subscribe({
        next: () => {
          this.#notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_SUCCESS');
          form.resetForm();
        },
        error: () => {
          this.#notificationService.twarning('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_ERROR');
        },
      });
  }
}

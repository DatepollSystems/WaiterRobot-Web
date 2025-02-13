import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {passwordMatchValidator} from '@home-shared/regex';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-password-change">
        {{ 'ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_INFO' | transloco }}
      </h4>
      <button class="btn-close btn-close-white" (mousedown)="activeModal.close(undefined)" type="button" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        @if (passwordForm.statusChanges | async) {}

        <form
          class="d-flex flex-column gap-3"
          [formGroup]="passwordForm"
          (ngSubmit)="activeModal.close(passwordForm.controls.newPassword.getRawValue())"
        >
          <div class="form-floating">
            <input
              class="form-control"
              id="password"
              [placeholder]="'PASSWORD' | transloco"
              type="password"
              formControlName="newPassword"
            />
            <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW' | transloco }}</label>
          </div>

          @if (passwordForm.controls.newPassword.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }}
            </small>
          }

          <div class="form-floating">
            <input
              class="form-control"
              id="password"
              [placeholder]="'PASSWORD' | transloco"
              type="password"
              formControlName="confirmPassword"
            />
            <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_AGAIN' | transloco }}</label>
          </div>

          @if (passwordForm.controls.confirmPassword.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }}
            </small>
          }

          @if (passwordForm.hasError('mismatch')) {
            <small class="text-danger">
              {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | transloco }}
            </small>
          }
        </form>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" (mousedown)="activeModal.close(undefined)" type="button">
        {{ 'CLOSE' | transloco }}
      </button>
      <button
        class="btn btn-success"
        [disabled]="passwordForm.invalid"
        (mousedown)="activeModal.close(passwordForm.controls.newPassword.getRawValue())"
        type="button"
      >
        {{ 'ABOUT_SIGNIN' | transloco }}
      </button>
    </div>
  `,
  selector: 'app-account-not-activated-modal',
  imports: [TranslocoPipe, FormsModule, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPasswordChangeDialogComponent {
  passwordForm = inject(FormBuilder).nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {validators: passwordMatchValidator},
  );

  activeModal = inject(NgbActiveModal);
}

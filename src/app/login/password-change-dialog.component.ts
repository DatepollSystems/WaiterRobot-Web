import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {passwordMatchValidator} from '../_shared/regex';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_INFO' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close(undefined)"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <ng-container *ngIf="passwordForm.statusChanges | async" />

        <form
          [formGroup]="passwordForm"
          (ngSubmit)="activeModal.close(passwordForm.controls.newPassword.getRawValue())"
          class="d-flex flex-column gap-3"
        >
          <div class="form-floating">
            <input class="form-control" type="password" id="password" formControlName="newPassword" placeholder="{{ 'PASSWORD' | tr }}" />
            <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW' | tr }}</label>
          </div>

          @if (passwordForm.controls.newPassword.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
            </small>
          }

          <div class="form-floating">
            <input
              class="form-control"
              type="password"
              id="password"
              formControlName="confirmPassword"
              placeholder="{{ 'PASSWORD' | tr }}"
            />
            <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_AGAIN' | tr }}</label>
          </div>

          @if (passwordForm.controls.confirmPassword.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
            </small>
          }

          @if (passwordForm.hasError('mismatch')) {
            <small class="text-danger">
              {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | tr }}
            </small>
          }
        </form>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close(undefined)">{{ 'CLOSE' | tr }}</button>
      <button
        type="button"
        class="btn btn-success"
        [disabled]="passwordForm.invalid"
        (click)="activeModal.close(passwordForm.controls.newPassword.getRawValue())"
      >
        {{ 'ABOUT_SIGNIN' | tr }}
      </button>
    </div>
  `,
  selector: 'app-account-not-activated-modal',
  standalone: true,
  imports: [DfxTr, NgIf, FormsModule, ReactiveFormsModule, AsyncPipe],
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

  constructor(public activeModal: NgbActiveModal) {}
}

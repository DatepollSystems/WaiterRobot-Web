import {AsyncPipe, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {delay, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

import {passwordMatchValidator} from '@home-shared/regex';

import {injectAPI} from '@shared/api';

@Component({
  template: `
    <div class="card w-100">
      <div class="card-body">
        @switch (resetState()) {
          @case ('REQUEST') {
            @if (requestPasswordResetForm.statusChanges | async) {}

            <form class="d-flex flex-column gap-3" [formGroup]="requestPasswordResetForm" (ngSubmit)="requestPasswordReset()">
              <h3>Password Zurücksetzung anfordern</h3>

              <div class="form-floating">
                <input
                  class="form-control"
                  id="email"
                  [placeholder]="'ABOUT_SIGNIN_EMAIL_ADDRESS' | transloco"
                  autocomplete="on"
                  type="email"
                  formControlName="email"
                />
                <label for="email">{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | transloco }}</label>
              </div>

              <div class="d-flex">
                <button class="btn btn-primary w-100" [disabled]="!requestPasswordResetForm.valid" type="submit">
                  {{ 'SENT' | transloco }}
                </button>
              </div>
            </form>

            @if (requestPasswordResetForm.valid) {
              <div class="text-center mt-4">
                <button class="btn btn-link" (click)="resetState.set('SET')" type="button">
                  {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_ALREADY_SENT' | transloco }}
                </button>
              </div>
            }
          }

          @case ('SET') {
            @if (resetPasswordForm.statusChanges | async) {}

            <form class="d-flex flex-column gap-3" [formGroup]="resetPasswordForm" (ngSubmit)="resetPassword()">
              <h3>{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET' | transloco }}</h3>

              <div class="alert alert-info d-flex" role="alert">
                {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_EMAIL_SENT' | transloco }}
              </div>

              <div class="form-floating">
                <input class="form-control" id="resetToken" type="text" formControlName="resetToken" placeholder="XXXXXXXXXXXXX" />
                <label for="resetToken">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET_TOKEN' | transloco }}</label>
              </div>

              @if (resetPasswordForm.controls.resetToken.invalid) {
                <small class="text-danger">
                  {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET_TOKEN_INCORRECT' | transloco }}
                </small>
              }

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

              @if (resetPasswordForm.controls.newPassword.invalid) {
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

              @if (resetPasswordForm.controls.confirmPassword.invalid) {
                <small class="text-danger">
                  {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }}
                </small>
              }

              @if (resetPasswordForm.hasError('mismatch')) {
                <small class="text-danger">
                  {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | transloco }}
                </small>
              }

              <div class="d-flex">
                <button class="btn btn-primary w-100" [disabled]="resetPasswordForm.invalid" type="submit">
                  {{ 'SENT' | transloco }}
                </button>
              </div>
            </form>
          }

          @case ('SUCCESS') {
            <div class="alert alert-success d-flex" role="alert">
              {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_SUCCESS' | transloco }}
            </div>

            <a class="btn btn-secondary" routerLink="/about">{{ 'GO_BACK' | transloco }}</a>
          }
        }
      </div>
    </div>
  `,
  selector: 'app-password-reset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, NgSwitch, NgSwitchCase, AsyncPipe, TranslocoPipe, BiComponent],
})
export class ForgotPasswordComponent {
  #router = inject(Router);
  #api = injectAPI();
  #fb = inject(FormBuilder);

  requestPasswordResetForm = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetPasswordForm = this.#fb.nonNullable.group(
    {
      resetToken: ['', [Validators.required, Validators.minLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {validators: passwordMatchValidator},
  );

  resetState = signal<'REQUEST' | 'SET' | 'SUCCESS'>('REQUEST');

  constructor() {
    const route = inject(ActivatedRoute);
    route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const email = params.get('email');
      const resetToken = params.get('resetToken');
      if (email && resetToken) {
        this.requestPasswordResetForm.controls.email.setValue(email);
        this.resetPasswordForm.controls.resetToken.setValue(resetToken);
        this.resetState.set('SET');

        return;
      }
      if (email) {
        this.requestPasswordResetForm.controls.email.setValue(email);
      }
    });
  }

  requestPasswordReset(): void {
    const email = this.requestPasswordResetForm.controls.email.getRawValue();
    this.#api
      .post('/v1/auth/resetPassword', {
        body: {email},
      })
      .subscribe(() => {
        this.resetState.set('SET');
      });
  }

  resetPassword(): void {
    const email = this.requestPasswordResetForm.controls.email.getRawValue();
    const resetToken = this.resetPasswordForm.controls.resetToken.getRawValue();
    const newPassword = this.resetPasswordForm.controls.newPassword.getRawValue();
    this.#api
      .post('/v1/auth/resetPassword/update', {
        body: {
          email,
          resetToken,
          newPassword,
        },
      })
      .pipe(
        tap(() => {
          this.resetState.set('SUCCESS');
        }),
        delay(5000),
      )
      .subscribe(() => {
        void this.#router.navigateByUrl('/about');
      });
  }
}

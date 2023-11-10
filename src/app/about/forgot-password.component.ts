import {AsyncPipe, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {delay, tap} from 'rxjs';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {passwordMatchValidator} from '../_shared/regex';
import {AuthService} from '../_shared/services/auth/auth.service';
import {AppOutsideLayoutComponent} from '../_shared/ui/app-outside-layout.component';

@Component({
  template: `
    <outside-layout-component>
      <div class="card w-100">
        <div class="card-body">
          <ng-container [ngSwitch]="resetState()">
            <ng-container *ngSwitchCase="'REQUEST'">
              <ng-container *ngIf="requestPasswordResetForm.statusChanges | async" />

              <form [formGroup]="requestPasswordResetForm" (ngSubmit)="requestPasswordReset()" class="d-flex flex-column gap-3">
                <h3>Password Zurücksetzung anfordern</h3>

                <div class="form-floating">
                  <input
                    class="form-control bg-dark text-white"
                    autocomplete="on"
                    type="email"
                    id="email"
                    formControlName="email"
                    placeholder="{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | tr }}"
                  />
                  <label for="email">{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | tr }}</label>
                </div>

                <div class="d-flex">
                  <button [disabled]="!requestPasswordResetForm.valid" type="submit" class="btn btn-primary w-100">
                    {{ 'SENT' | tr }}
                  </button>
                </div>
              </form>

              <div class="text-center mt-4" *ngIf="requestPasswordResetForm.valid">
                <button class="btn btn-link" (click)="resetState.set('SET')">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_ALREADY_SENT' | tr }}</button>
              </div>
            </ng-container>

            <ng-container *ngSwitchCase="'SET'">
              <ng-container *ngIf="resetPasswordForm.statusChanges | async" />

              <form [formGroup]="resetPasswordForm" (ngSubmit)="resetPassword()" class="d-flex flex-column gap-3">
                <h3>{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET' | tr }}</h3>

                <div class="alert alert-info d-flex" role="alert">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_EMAIL_SENT' | tr }}</div>

                <div class="form-floating">
                  <input
                    class="form-control bg-dark text-white"
                    type="text"
                    id="resetToken"
                    formControlName="resetToken"
                    placeholder="XXXXXXXXXXXXX"
                  />
                  <label for="resetToken">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET_TOKEN' | tr }}</label>
                </div>

                <small class="text-danger" *ngIf="resetPasswordForm.controls.resetToken.invalid">
                  {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_RESET_TOKEN_INCORRECT' | tr }}
                </small>

                <div class="form-floating">
                  <input
                    class="form-control bg-dark text-white"
                    type="password"
                    id="password"
                    formControlName="newPassword"
                    placeholder="{{ 'PASSWORD' | tr }}"
                  />
                  <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW' | tr }}</label>
                </div>

                <small class="text-danger" *ngIf="resetPasswordForm.controls.newPassword.invalid">
                  {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
                </small>

                <div class="form-floating">
                  <input
                    class="form-control bg-dark text-white"
                    type="password"
                    id="password"
                    formControlName="confirmPassword"
                    placeholder="{{ 'PASSWORD' | tr }}"
                  />
                  <label for="password">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_AGAIN' | tr }}</label>
                </div>

                <small class="text-danger" *ngIf="resetPasswordForm.controls.confirmPassword.invalid">
                  {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
                </small>

                <small class="text-danger" *ngIf="resetPasswordForm.hasError('mismatch')">
                  {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | tr }}
                </small>

                <div class="d-flex">
                  <button [disabled]="!resetPasswordForm.valid" type="submit" class="btn btn-primary w-100">
                    {{ 'SENT' | tr }}
                  </button>
                </div>
              </form>
            </ng-container>

            <ng-container *ngSwitchCase="'SUCCESS'">
              <div class="alert alert-success d-flex" role="alert">
                {{ 'ABOUT_SIGNIN_FORGOT_PASSWORD_SUCCESS' | tr }}
              </div>

              <a routerLink="/about" class="btn btn-secondary">{{ 'GO_BACK' | tr }}</a>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </outside-layout-component>
  `,
  selector: 'app-password-reset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgSwitch, NgSwitchCase, AsyncPipe, DfxTr, BiComponent, AppOutsideLayoutComponent],
})
export class ForgotPasswordComponent {
  fb = inject(FormBuilder);

  requestPasswordResetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetPasswordForm = this.fb.nonNullable.group(
    {
      resetToken: ['', [Validators.required, Validators.minLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {validators: passwordMatchValidator},
  );

  resetState = signal<'REQUEST' | 'SET' | 'SUCCESS'>('REQUEST');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
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
    this.authService.sendPasswordResetRequest(email).subscribe(() => this.resetState.set('SET'));
  }

  resetPassword(): void {
    const email = this.requestPasswordResetForm.controls.email.getRawValue();
    const resetToken = this.resetPasswordForm.controls.resetToken.getRawValue();
    const newPassword = this.resetPasswordForm.controls.newPassword.getRawValue();
    this.authService
      .sendPasswordReset(email, resetToken, newPassword)
      .pipe(
        tap(() => this.resetState.set('SUCCESS')),
        delay(5000),
      )
      .subscribe(() => {
        void this.router.navigateByUrl('/about');
      });
  }
}

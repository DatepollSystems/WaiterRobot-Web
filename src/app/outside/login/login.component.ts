import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {injectIsValid} from '@shared/form';
import {AppDownloadBtnListComponent} from '@shared/ui/app-download-btn-list.component';

import {loggerOf} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingFails, DfxHideIfPingSucceeds} from 'dfx-helper';

import {map, shareReplay} from 'rxjs';
import {NotificationService} from 'src/app/_shared/notifications/notification.service';
import {AuthService} from 'src/app/_shared/services/auth/auth.service';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

@Component({
  template: `
    @if (formValid()) {}

    <div class="d-flex flex-column gap-3">
      <form class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="onSignIn()">
        <h1 class="fs-2">{{ 'ABOUT_SIGNIN' | transloco }}</h1>
        <div class="alert alert-warning" role="alert" hideIfOnline>
          <bi name="wifi-off" />
          {{ 'OFFLINE' | transloco }}
        </div>

        <div hideIfOffline>
          <div class="alert alert-warning" role="alert" hideIfPingSucceeds url="/json">
            <div class="d-flex gap-3 align-items-center">
              <bi name="exclamation-triangle-fill" />
              <div>
                <b>{{ 'ABOUT_MAINTENANCE_1' | transloco }}</b> {{ 'ABOUT_MAINTENANCE_2' | transloco }}
                <br />
                Besuche
                <a style="text-decoration: underline; color: #664d03" href="https://status.kellner.team" target="_blank" rel="noreferrer"
                  >status.kellner.team</a
                >
                für weitere Informationen!
              </div>
            </div>
          </div>
          <div class="d-flex flex-column gap-3" hideIfPingFails url="/json">
            <div class="d-flex flex-column">
              <div class="form-floating">
                <input
                  class="form-control"
                  autocomplete="on"
                  type="email"
                  id="email"
                  formControlName="email"
                  [placeholder]="'ABOUT_SIGNIN_EMAIL_ADDRESS' | transloco"
                />
                <label for="email">{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | transloco }}</label>
              </div>

              <div class="form-floating">
                <input
                  class="form-control"
                  autocomplete="on"
                  type="password"
                  id="password"
                  formControlName="password"
                  [placeholder]="'ABOUT_SIGNIN_PASSWORD' | transloco"
                />
                <label for="password">{{ 'ABOUT_SIGNIN_PASSWORD' | transloco }}</label>
              </div>
            </div>

            <div class="d-flex">
              <button type="submit" class="btn btn-primary w-100" [disabled]="!form.valid">{{ 'ABOUT_SIGNIN' | transloco }}</button>
            </div>

            <div class="text-center">
              <a routerLink="forgot-password">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD' | transloco }}</a>
            </div>
          </div>
        </div>
      </form>

      <hr />

      <h5 class="my-0">{{ 'ABOUT_APP_DISCOVER' | transloco }}</h5>
      <app-download-btn-list [showQRCodeButton]="false" />
    </div>
  `,
  styles: `
    .form-floating:focus-within {
      z-index: 2;
    }
    input[type='email'] {
      z-index: 400;
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    input[type='password'] {
      margin-bottom: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `,
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoPipe,
    AppDownloadBtnListComponent,
    ReactiveFormsModule,
    DfxHideIfPingSucceeds,
    DfxHideIfPingFails,
    DfxHideIfOnline,
    DfxHideIfOffline,
    BiComponent,
  ],
})
export class LoginComponent {
  router = inject(Router);
  modal = inject(NgbModal);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  queryParams = inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed(), shareReplay(1));

  isPreview = toSignal(this.queryParams.pipe(map((params) => !!params.get('preview'))), {initialValue: true});

  logger = loggerOf('LoginComponent');

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.min(3)]],
    password: ['', [Validators.required, Validators.min(0)]],
  });

  formValid = injectIsValid(this.form);

  constructor() {
    this.queryParams.subscribe((params) => {
      this.logger.log('const', 'URL params', params);
      const email = params.get('email');
      const password = params.get('onetimePassword');
      if (email && password) {
        this.form.controls.email.setValue(email);
        this.form.controls.password.setValue(password);
        this.onSignIn();
      }
    });

    effect(() => {
      if (this.authService.loginError() === 'ACCOUNT_NOT_ACTIVATED') {
        this.modal.open(AppAccountNotActivatedDialog, {ariaLabelledBy: 'modal-account-deactivated'});
      }

      if (this.authService.loginError() === 'PASSWORD_CHANGE_REQUIRED') {
        void this.modal.open(AppPasswordChangeDialogComponent, {ariaLabelledBy: 'modal-password-change'}).result.then((result) => {
          if (result) {
            if (result === this.form.controls.password.getRawValue()) {
              this.notificationService.terror('ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_FAILED');
              return;
            }
            this.authService.triggerLoginWithPwChange.next({
              email: this.form.controls.email.getRawValue(),
              newPassword: result as string,
              oldPassword: this.form.controls.password.getRawValue(),
            });
          }
        });
      }
    });

    effect(() => {
      if (this.authService.status() === 'LOGGED_IN' && !this.isPreview()) {
        void this.router.navigateByUrl(this.authService.redirectUrl() ?? '/');
        this.notificationService.success('Erfolgreich angemeldet!');
      }
    });
  }

  onSignIn(): void {
    const email = this.form.controls.email.getRawValue();
    const password = this.form.controls.password.getRawValue();

    this.authService.triggerLogin.next({email, password});
  }
}

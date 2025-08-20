import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {catchError, map, of, shareReplay, switchMap, timer} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {injectNetwork} from 'ngxtension/inject-network';

import {injectAPI} from '../../api';
import {AccountNotActivatedModal} from '../../components/account-not-activated-dialog.modal';
import {AppDownloadBtnListComponent} from '../../components/app-download-btn-list.component';
import {PasswordChangeDialogModal} from '../../components/password-change-dialog.modal';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationService} from '../../services/notification.service';
import {injectIsValid} from '../../util/form';

@Component({
  template: `
    @if (formValid()) {}

    <div class="d-flex flex-column gap-3">
      <form class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="onSignIn()">
        <h1 class="fs-2">{{ 'ABOUT_SIGNIN' | transloco }}</h1>

        @if (networkState.online()) {
          @if (pingFails()) {
            <div class="alert alert-warning" role="alert">
              <div class="d-flex gap-3 align-items-center">
                <bi name="exclamation-triangle-fill" />
                <div>
                  <b>{{ 'ABOUT_MAINTENANCE_1' | transloco }}</b>
                  {{ 'ABOUT_MAINTENANCE_2' | transloco }}
                  <br />
                  Besuche
                  <a style="text-decoration: underline; color: #664d03" href="https://status.kellner.team" target="_blank" rel="noreferrer"
                    >status.kellner.team</a
                  >
                  für weitere Informationen!
                </div>
              </div>
            </div>
          } @else {
            <div class="d-flex flex-column gap-3">
              <div class="d-flex flex-column">
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

                <div class="form-floating">
                  <input
                    class="form-control"
                    id="password"
                    [placeholder]="'ABOUT_SIGNIN_PASSWORD' | transloco"
                    autocomplete="on"
                    type="password"
                    formControlName="password"
                  />
                  <label for="password">{{ 'ABOUT_SIGNIN_PASSWORD' | transloco }}</label>
                </div>
              </div>

              <div class="d-flex">
                <button class="btn btn-primary w-100" [disabled]="!form.valid" type="submit">
                  {{ 'ABOUT_SIGNIN' | transloco }}
                </button>
              </div>

              <div class="text-center">
                <a routerLink="forgot-password">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD' | transloco }}</a>
              </div>
            </div>
          }
        } @else {
          <div class="alert alert-warning" role="alert">
            <bi name="wifi-off" />
            {{ 'OFFLINE' | transloco }}
          </div>
        }
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
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, AppDownloadBtnListComponent, ReactiveFormsModule, BiComponent],
})
export class LoginPage {
  router = inject(Router);
  modal = inject(NgbModal);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  queryParams = inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed(), shareReplay(1));

  networkState = injectNetwork();

  isPreview = toSignal(this.queryParams.pipe(map((params) => !!params.get('preview'))), {initialValue: true});

  logger = loggerOf('LoginComponent');

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.min(3)]],
    password: ['', [Validators.required, Validators.min(0)]],
  });

  formValid = injectIsValid(this.form);

  #api = injectAPI();

  pingFails = toSignal(
    timer(0, 30 * 1000).pipe(
      takeUntilDestroyed(),
      switchMap(() => this.#api.get('/v1/json')),
      map(() => false),
      catchError(() => of(true)),
    ),
  );

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
        this.modal.open(AccountNotActivatedModal, {
          ariaLabelledBy: 'modal-account-deactivated',
        });
      }

      if (this.authService.loginError() === 'PASSWORD_CHANGE_REQUIRED') {
        void this.modal
          .open(PasswordChangeDialogModal, {
            ariaLabelledBy: 'modal-password-change',
          })
          .result.then((result) => {
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

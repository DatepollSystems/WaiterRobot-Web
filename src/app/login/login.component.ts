import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingFails, DfxHideIfPingSucceeds} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {NotificationService} from '../_shared/notifications/notification.service';
import {AuthService} from '../_shared/services/auth/auth.service';
import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {AppOutsideLayoutComponent} from '../_shared/ui/app-outside-layout.component';
import {AppDownloadBtnListComponent} from '../_shared/ui/button/app-download-btn-list.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {JwtResponse} from '../_shared/waiterrobot-backend';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

@Component({
  template: `
    <outside-layout-component>
      <ng-container *ngIf="form.statusChanges | async" />

      <form [formGroup]="form" (ngSubmit)="onSignIn()" class="d-flex flex-column gap-3">
        <div class="alert alert-warning" role="alert" hideIfOnline>
          <bi name="wifi-off" />
          {{ 'OFFLINE' | tr }}
        </div>

        <div hideIfOffline>
          <div class="alert alert-warning" role="alert" hideIfPingSucceeds url="/json">
            <div class="d-flex gap-3 align-items-center">
              <bi name="exclamation-triangle-fill" />
              <div>
                <b>{{ 'ABOUT_MAINTENANCE_1' | tr }}</b> {{ 'ABOUT_MAINTENANCE_2' | tr }}
                <br />
                Besuche
                <a style="text-decoration: underline; color: #664d03" href="https://status.kellner.team" target="_blank" rel="noopener"
                  >status.kellner.team</a
                >
                für weitere Informationen!
              </div>
            </div>
          </div>
          <div hideIfPingFails url="/json" class="d-flex flex-column">
            <h1 class="fs-2">{{ 'ABOUT_SIGNIN' | tr }}</h1>
            <div class="form-floating">
              <input
                class="form-control"
                autocomplete="on"
                type="email"
                id="email"
                formControlName="email"
                placeholder="{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | tr }}"
              />
              <label for="email">{{ 'ABOUT_SIGNIN_EMAIL_ADDRESS' | tr }}</label>
            </div>

            <div class="form-floating">
              <input
                class="form-control"
                autocomplete="on"
                type="password"
                id="password"
                formControlName="password"
                placeholder="{{ 'ABOUT_SIGNIN_PASSWORD' | tr }}"
              />
              <label for="password">{{ 'ABOUT_SIGNIN_PASSWORD' | tr }}</label>
            </div>

            <div class="d-flex">
              <button [disabled]="!form.valid" type="submit" class="btn btn-primary w-100">{{ 'ABOUT_SIGNIN' | tr }}</button>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a routerLink="forgot-password">{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD' | tr }}</a>
        </div>
      </form>

      <h5 class="mt-5">{{ 'ABOUT_APP_DISCOVER' | tr }}</h5>
      <app-download-btn-list [showQRCodeButton]="false" />
    </outside-layout-component>
  `,
  styles: `

.form-floating:focus-within {
  z-index: 2;
}
  input[type="email"] {
  z-index: 400;
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

input[type="password"] {
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
    DfxTr,
    AppLogoWithTextComponent,
    AppDownloadBtnListComponent,
    FooterModule,
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    DfxHideIfPingSucceeds,
    DfxHideIfPingFails,
    DfxHideIfOnline,
    DfxHideIfOffline,
    BiComponent,
    AppOutsideLayoutComponent,
  ],
})
export class LoginComponent {
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.min(3)]],
    password: ['', [Validators.required, Validators.min(0)]],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      console.log(params);
      if (params.get('email') && params.get('onetimePassword')) {
        // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
        this.form.controls.email.setValue(params.get('email')!!);
        // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
        this.form.controls.password.setValue(params.get('onetimePassword')!!);
        this.onSignIn();
      }
    });
  }

  onSuccessfulSignIn = (response: JwtResponse): void => {
    this.authService.setJWTToken(response.accessToken);
    this.authService.setSessionToken(response.refreshToken);
    this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');

    void this.router.navigateByUrl(this.authService.redirectUrl ?? '/');
  };

  onSignIn(): void {
    const email = this.form.controls.email.getRawValue();
    const password = this.form.controls.password.getRawValue();
    this.authService.sendSignInRequest(email, password).subscribe({
      next: (response) => this.onSuccessfulSignIn(response),
      error: (error) => {
        if (error?.error?.codeName === 'ACCOUNT_NOT_ACTIVATED') {
          this.modal.open(AppAccountNotActivatedDialog);
          return;
        }

        if (error?.error?.codeName === 'PASSWORD_CHANGE_REQUIRED') {
          void this.modal.open(AppPasswordChangeDialogComponent)?.result?.then((result) => {
            if (result) {
              if (result === password) {
                this.notificationService.terror('ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_FAILED');
                return;
              }
              this.authService.sendSignInWithPasswordChangeRequest(email, password, result as string).subscribe({
                next: (response) => this.onSuccessfulSignIn(response),
                error: () => {
                  this.notificationService.terror('ABOUT_SIGNIN_FAILED');
                },
              });
            }
          });

          return;
        }

        this.notificationService.terror('ABOUT_SIGNIN_FAILED');
      },
    });
  }
}

import {AsyncPipe, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {catchError, filter, of, switchMap, timer} from 'rxjs';

import {AuthService} from '../_shared/services/auth/auth.service';
import {AppDownloadBtnListComponent} from '../_shared/ui/app-download-btn-list.component';
import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {JWTResponse} from '../_shared/waiterrobot-backend';
import {NotificationService} from '../notifications/notification.service';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

@Component({
  template: `
    <div class="d-container text-white">
      <div class="container-md d-flex flex-column gap-4">
        <app-logo-with-text />
        <div class="d-flex flex-column flex-lg-row gap-5 justify-content-around">
          <div class="col d-flex flex-column gap-3 ">
            <div class="card bg-dark pt-2">
              <div class="card-body">
                <ng-container *ngIf="form.statusChanges | async" />

                <form [formGroup]="form" (ngSubmit)="onSignIn()" class="d-flex flex-column gap-2 py-2">
                  <div class="alert alert-warning" role="alert" *ngIf="error$ | async; else loginForm">
                    {{ 'ABOUT_MAINTENANCE' | tr }}
                  </div>
                  <ng-template #loginForm>
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

                    <div class="form-floating">
                      <input
                        class="form-control bg-dark text-white"
                        autocomplete="on"
                        type="password"
                        id="password"
                        formControlName="password"
                        placeholder="{{ 'ABOUT_SIGNIN_PASSWORD' | tr }}"
                      />
                      <label for="password">{{ 'ABOUT_SIGNIN_PASSWORD' | tr }}</label>
                    </div>
                  </ng-template>

                  <button [disabled]="!form.valid" type="submit" class="btn btn-primary">{{ 'ABOUT_SIGNIN' | tr }}</button>

                  <div style="text-align: center; margin-top: 5px">
                    <a (click)="onForgotPassword()" routerLink="/about">{{ 'ABOUT_SIGNIN_TROUBLE_LOGGING_IN' | tr }}</a>
                  </div>
                </form>
              </div>
            </div>

            <div class="card bg-dark">
              <div class="card-body">
                <h5 class="card-title">{{ 'ABOUT_APP_DISCOVER' | tr }}</h5>
                <app-download-btn-list [showQRCodeButton]="false" />
              </div>
            </div>
          </div>

          <div class="col d-flex flex-column gap-3">
            <div class="card bg-dark">
              <div class="card-body">
                <p class="card-text">
                  Mit kellner.team hast du die Möglichkeit, deine Bestellungsaufnahme digital zu erledigen. <br /><br />
                  Egal ob sich um ein einmaliges Event oder dauerhafte Bewirtung handelt, kellner.team beschleunigt deinen Prozess im
                  Servicebereich.
                </p>
              </div>
            </div>

            <div class="card bg-dark">
              <div class="card-body">
                <h5 class="card-title">{{ 'ABOUT_MORE_INFORMATION' | tr }}</h5>
                <div class="card-text">
                  <a href="https://kellner.team" target="_blank" rel="noopener">kellner.team</a> &
                  <a href="https://datepollsystems.org" target="_blank" rel="noopener">DatePoll-Systems</a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer container="container-md" />
  `,
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DfxTr, AppLogoWithTextComponent, AppDownloadBtnListComponent, FooterModule, AsyncPipe, NgIf, ReactiveFormsModule],
})
export class AboutComponent {
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.min(3)]],
    password: ['', [Validators.required, Validators.min(0)]],
  });

  error$ = timer(0, 10 * 1000).pipe(
    switchMap(() =>
      this.httpClient.get('/json').pipe(
        catchError(() => of(true)),
        filter((it) => it === true)
      )
    )
  );

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private modal: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  onForgotPassword(): void {
    this.modal.open(AppForgotPasswordDialog);
  }

  onSuccessfulSignIn = (response: JWTResponse): void => {
    this.authService.setJWTToken(response.accessToken);
    this.authService.setSessionToken(response.refreshToken);
    this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');

    void this.router.navigateByUrl(this.authService.redirectUrl ?? '/home');
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

import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UIHelper} from 'dfx-helper';
import {JWTResponse} from '../_models/waiterrobot-backend';

import {AuthService} from '../_services/auth/auth.service';
import {NotificationService} from '../_services/notifications/notification.service';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(
    private router: Router,
    private modal: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (UIHelper.getApproxCurrentDate().getMonth() === 5) {
      document.getElementById('brand')?.classList.add('rainbow-text');
    } else {
      document.getElementById('brand')?.classList.add('text-white');
    }
  }

  onForgotPassword(): void {
    this.modal.open(AppForgotPasswordDialog);
  }

  onSuccessfulSignIn = (response: JWTResponse) => {
    this.authService.setJWTToken(response.token);
    this.authService.setSessionToken(response.sessionToken);
    this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');

    void this.router.navigateByUrl('/home');
  };

  onSignin(form: NgForm): void {
    const email = form.value.email as string;
    const password = form.value.password as string;
    this.authService.sendSignInRequest(email, password).subscribe({
      next: (response) => this.onSuccessfulSignIn(response),
      error: (error) => {
        if (error?.error?.codeName === 'ACCOUNT_NOT_ACTIVATED') {
          this.modal.open(AppAccountNotActivatedDialog);
          return;
        }

        if (error?.error?.codeName === 'PASSWORD_CHANGE_REQUIRED') {
          this.modal.open(AppPasswordChangeDialogComponent)?.result?.then((result) => {
            if (result) {
              if (result === password) {
                this.notificationService.terror('ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_FAILED');
                return;
              }
              this.authService.sendSignInWithPasswordChangeRequest(email, password, result).subscribe({
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

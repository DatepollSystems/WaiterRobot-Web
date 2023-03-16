import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';

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
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  //TODO: Change to onpush
  standalone: true,
  imports: [FormsModule, RouterLink, DfxTr, AppLogoWithTextComponent, AppDownloadBtnListComponent, FooterModule],
})
export class AboutComponent implements OnInit {
  constructor(
    private router: Router,
    private modal: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (new Date().getMonth() === 5) {
      document.getElementById('brand')?.classList.add('rainbow-text');
    } else {
      document.getElementById('brand')?.classList.add('text-white');
    }
  }

  onForgotPassword(): void {
    this.modal.open(AppForgotPasswordDialog);
  }

  onSuccessfulSignIn = (response: JWTResponse): void => {
    this.authService.setJWTToken(response.accessToken);
    this.authService.setSessionToken(response.refreshToken);
    this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');

    void this.router.navigateByUrl(this.authService.redirectUrl ?? '/home');
  };

  onSignIn(form: NgForm): void {
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

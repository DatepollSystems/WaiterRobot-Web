import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UIHelper} from 'dfx-helper';
import {JWTResponse} from '../_models/waiterrobot-backend';

import {AuthService} from '../_services/auth/auth.service';
import {NotificationService} from '../_services/notifications/notification.service';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  private returnUrl?: string;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.returnUrl) {
        this.returnUrl = params.returnUrl;
      }
    });

    if (UIHelper.getApproxCurrentDate().getMonth() === 5) {
      document.getElementById('brand')?.classList.add('rainbow-text');
    } else {
      document.getElementById('brand')?.classList.add('text-white');
    }
  }

  onForgotPassword(): void {
    this.modal.open(AppForgotPasswordDialog);
  }

  onSignin(form: NgForm): void {
    const email = form.value.email as string;
    const password = form.value.password as string;
    this.authService.sendSignInRequest(email, password).subscribe({
      next: (data: JWTResponse) => {
        this.authService.setJWTToken(data.token);
        this.authService.setSessionToken(data.sessionToken);
        this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');
        const url = this.returnUrl ?? '/home';
        void this.router.navigateByUrl(url);
      },
      error: (error) => {
        if (error?.error?.codeName === 'ACCOUNT_NOT_ACTIVATED') {
          //|| error.error.error_code === 'change_password'
          this.modal.open(AppAccountNotActivatedDialog);

          return;
        }

        this.notificationService.terror('ABOUT_SIGNIN_FAILED');
      },
    });
  }
}

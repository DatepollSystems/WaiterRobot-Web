import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../_services/auth/auth.service';
import {NotificationService} from '../_services/notifications/notification.service';
import {UIHelper} from 'dfx-helper';
import {JWTResponse} from '../_models/waiterrobot-backend';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    if (UIHelper.getApproxCurrentDate().getMonth() === 5) {
      document.getElementById('brand')?.classList.add('rainbow-text');
    } else {
      document.getElementById('brand')?.classList.add('text-white');
    }
  }

  onSignin(form: NgForm): void {
    const email = form.value.email as string;
    const password = form.value.password as string;
    this.authService.sendSignInRequest(email, password).subscribe({
      next: (data: JWTResponse) => {
        this.authService.setJWTToken(data.token);
        this.authService.setSessionToken(data.sessionToken);
        this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');
        const url = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
        void this.router.navigateByUrl(url);
      },
      error: (error) => {
        console.log(error);

        // if (error.error.error_code != null) {
        //   if (error.error.error_code === 'not_activated' || error.error.error_code === 'change_password') {
        //     this.router.navigateByUrl('/auth/signin', {
        //       state: {routingReason: 'forward', state: error.error.error_code, username, password},
        //     });
        //
        //     return;
        //   }
        // }
        // this.router.navigateByUrl('/auth/signin', {state: {routingReason: 'loginFailed', username, password}});
      },
    });
  }
}

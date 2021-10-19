import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../_services/auth/auth.service';
import {NotificationService} from '../_services/notifications/notification.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router) {}

  onSignin(form: NgForm): void {
    const username = form.value.username;
    const password = form.value.password;
    this.authService.sendSignInRequest(username, password).subscribe(
      (data: any) => {
        console.log(data);
        this.authService.setJWTToken(data.access_token);
        this.authService.setSessionToken(data.session_token);
        this.notificationService.tsuccess('ABOUT_SIGNIN_SUCCESSFUL');
        const url = this.authService.redirectUrl != null ? this.authService.redirectUrl : '/home';
        void this.router.navigateByUrl(url);
      },
      (error) => {
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
      }
    );
  }
}

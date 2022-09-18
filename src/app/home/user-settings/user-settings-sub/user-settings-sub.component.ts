import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AComponent, StringHelper} from 'dfx-helper';
import {MyUserService} from '../../../_services/auth/my-user.service';

import {UserSettingsService} from '../../../_services/models/user/user-settings.service';
import {NotificationService} from '../../../_services/notifications/notification.service';

@Component({
  selector: 'app-user-settings-sub',
  templateUrl: './user-settings-sub.component.html',
  styleUrls: ['./user-settings-sub.component.scss'],
})
export class UserSettingsSubComponent extends AComponent {
  newPasswordsMatch = false;
  newPassword = '';
  newPasswordAgain = '';

  emailAddressValid = true;
  emailAddress: string | undefined = '';

  constructor(
    private notificationService: NotificationService,
    private myUserService: MyUserService,
    private userSettingsService: UserSettingsService
  ) {
    super();

    this.emailAddress = this.myUserService.getUser()?.emailAddress;
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.emailAddress = user.emailAddress;
      })
    );
  }

  emailChange(email: string): void {
    this.emailAddressValid = StringHelper.isEmail(email);
  }

  changeEmail(form: NgForm): void {
    this.userSettingsService.changeEmail({emailAddress: form.form.value.email as string}).subscribe(() => {
      this.notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_EMAIL_SUCCESS');
    });
  }

  newPasswordsChange(password: string | undefined, passwordAgain: string | undefined): void {
    if (password) {
      this.newPassword = password;
    }
    if (passwordAgain) {
      this.newPasswordAgain = passwordAgain;
    }
    if (this.newPassword.trim().length > 0 && this.newPasswordAgain.trim().length > 0) {
      this.newPasswordsMatch = this.newPassword === this.newPasswordAgain;
      if (this.newPasswordsMatch) {
        if (this.newPassword.toLowerCase() === 'do the barrel roll') {
          document.getElementById('body')?.classList.add('roll');
          this.autoClear(
            window.setTimeout(() => {
              document.getElementById('body')?.classList.remove('roll');
            }, 4100)
          );
        }
      }
    }
  }

  changePassword(form: NgForm): void {
    this.userSettingsService
      .changePassword({oldPassword: form.form.value.oldPassword as string, newPassword: form.form.value.newPassword as string})
      .subscribe({
        next: () => {
          this.notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_SUCCESS');
          form.resetForm();
        },
        error: () => {
          this.notificationService.twarning('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_ERROR');
        },
      });
  }
}

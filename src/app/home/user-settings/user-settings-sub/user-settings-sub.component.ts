import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {s_isEmail} from 'dfts-helper';

import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {NotificationService} from '../../../notifications/notification.service';

import {UserSettingsService} from '../_services/user-settings.service';

@Component({
  selector: 'app-user-settings-sub',
  templateUrl: './user-settings-sub.component.html',
  imports: [FormsModule, NgIf, DfxTr],
  standalone: true,
})
export class UserSettingsSubComponent extends AComponent {
  newPasswordsMatch = false;
  newPassword = '';
  newPasswordAgain = '';

  emailAddressValid = true;
  emailAddress: string | undefined = '';

  constructor(
    myUserService: MyUserService,
    private notificationService: NotificationService,
    private userSettingsService: UserSettingsService
  ) {
    super();

    this.unsubscribe(myUserService.getUser$().subscribe((it) => (this.emailAddress = it.emailAddress)));
  }

  emailChange(email: string): void {
    this.emailAddressValid = s_isEmail(email);
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

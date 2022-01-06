import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UpdateEmailDto, UpdatePasswordDto, UserSettingsService} from '../../../_services/models/user-settings.service';
import {NotificationService} from '../../../_services/notifications/notification.service';
import {AComponent, StringHelper} from 'dfx-helper';
import {MyUserService} from '../../../_services/my-user.service';

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

    this.emailAddress = this.myUserService.getUser()?.email_address;
    this.autoUnsubscribe(
      this.myUserService.userChange.subscribe((user) => {
        this.emailAddress = user.email_address;
      })
    );
  }

  emailChange(email: string) {
    this.emailAddressValid = StringHelper.isEmail(email);
  }

  changeEmail(form: NgForm) {
    this.userSettingsService.changeEmail(new UpdateEmailDto(form.form.value.email)).subscribe(() => {
      this.notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_EMAIL_SUCCESS');
    });
  }

  newPasswordsChange(password: string | undefined, passwordAgain: string | undefined) {
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

  changePassword(form: NgForm) {
    this.userSettingsService.changePassword(new UpdatePasswordDto(form.form.value.oldPassword, form.form.value.newPassword)).subscribe(
      () => {
        this.notificationService.tsuccess('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_SUCCESS');
        form.resetForm();
      },
      () => {
        this.notificationService.twarning('HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_ERROR');
      }
    );
  }
}

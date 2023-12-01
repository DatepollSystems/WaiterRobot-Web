import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';

import {BehaviorSubject, map} from 'rxjs';

import {s_isEmail} from 'dfts-helper';
import {NgSub, WINDOW} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {NotificationService} from '../../../_shared/notifications/notification.service';
import {MyUserService} from '../../_shared/services/user/my-user.service';
import {UserSettingsService} from '../_services/user-settings.service';

@Component({
  selector: 'app-user-settings-sub',
  templateUrl: './user-settings-sub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DfxTr, AsyncPipe, NgSub],
  standalone: true,
})
export class UserSettingsSubComponent {
  newPasswordsMatch = false;
  newPassword = '';
  newPasswordAgain = '';

  emailAddressValid$ = new BehaviorSubject(true);
  emailAddress$ = this.myUserService.getUser$().pipe(map((u) => u.emailAddress));

  constructor(
    private myUserService: MyUserService,
    @Inject(WINDOW) window: Window | undefined,
    private notificationService: NotificationService,
    private userSettingsService: UserSettingsService,
  ) {}

  emailChange(email: string): void {
    this.emailAddressValid$.next(s_isEmail(email));
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
          window?.setTimeout(() => {
            document.getElementById('body')?.classList.remove('roll');
          }, 4100);
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

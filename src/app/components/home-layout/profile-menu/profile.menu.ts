import {UpperCasePipe} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';

import {AuthService} from '@shared/services';

import {FullScreenService} from '../../../services/fullscreen.service';
import {QrCodeService} from '../../../services/qr-code.service';
import {MyUserService} from '../../../services/user/my-user.service';
import {AppTextColorByBackgroundDirective} from '../../color/app-text-color-by-background.directive';
import {s_toColor} from '../colors';
import {ThemePicker} from '../theme-picker';

@Component({
  template: `
    <div ngbDropdown display="dynamic" autoClose="outside">
      <a class="nav-link d-inline-flex align-items-center" id="settingsDropdown" ngbDropdownToggle>
        @if (myUser(); as user) {
          <strong
            class="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
            [style.background-color]="user.color"
            [color]="user.color"
            style="width: 32px; height: 32px"
            app-text-color-by-background
          >
            {{ user.firstname | s_cut: 1 : '' | uppercase }}{{ user.surname | s_cut: 1 : '' | uppercase }}
          </strong>
          <strong>{{ user.firstname }}</strong>
        } @else {
          {{ 'SETTINGS' | transloco }}
        }
      </a>
      <div ngbDropdownMenu aria-labelledby="settingsDropdown">
        <div class="px-3 py-1">
          @if (myUserService.user(); as user) {
            <a (mousedown)="openUserEmailQRCode()">
              <u>{{ user.emailAddress }}</u>
              <bi class="ms-1" name="qr-code" />
            </a>
          }

          <small>
            <br />
            @if (myUserService.user()?.isAdmin) {
              <b class="clickable" (mousedown)="switchAdminMode()">
                {{ 'NAV_USER_SETTINGS_ADMIN' | transloco }}
              </b>
            }
            @if (myUserService.manualOverwritten() && !myUserService.user()?.isAdmin) {
              <b class="clickable" (mousedown)="switchAdminMode()">
                {{ 'NAV_USER_SETTINGS_ADMIN_SWITCH' | transloco }}
              </b>
            }
          </small>
        </div>
        <div class="dropdown-divider d-none d-xxl-block"></div>

        <theme-picker />

        <button
          class="d-none d-xxl-flex gap-2 align-items-center"
          (mousedown)="fullScreenService.setFullScreen(!fullScreenService.isFullScreen()); $event.stopPropagation()"
          type="button"
          ngbDropdownItem
        >
          @if (fullScreenService.isFullScreen()) {
            <bi name="fullscreen-exit" />
          } @else {
            <bi name="arrows-fullscreen" />
          }
          {{ 'NAV_FULLSCREEN' | transloco }}
        </button>

        <div class="dropdown-divider"></div>
        <a class="d-flex gap-2 align-items-center" ngbDropdownItem routerLinkActive="active" routerLink="/usettings/settings">
          <bi name="gear-wide-connected" />
          {{ 'NAV_USER_SETTINGS' | transloco }}
        </a>
        <a class="d-flex gap-2 align-items-center" ngbDropdownItem routerLinkActive="active" routerLink="/usettings/sessions">
          <bi name="file-lock" />
          {{ 'NAV_USER_SESSIONS' | transloco }}
        </a>
        <button class="d-flex gap-2 align-items-center" (click)="this.authService.logout()" type="button" ngbDropdownItem>
          <bi name="box-arrow-left" />
          {{ 'NAV_LOGOUT' | transloco }}
        </button>
      </div>
    </div>
  `,
  imports: [
    BiComponent,
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    RouterLinkActive,
    ThemePicker,
    TranslocoPipe,
    DfxCutPipe,
    UpperCasePipe,
    AppTextColorByBackgroundDirective,
  ],
  selector: 'profile-menu',
})
export class ProfileMenu {
  #lumber = loggerOf('ProfileMenuComponent');

  myUserService = inject(MyUserService);
  qrCodeService = inject(QrCodeService);
  authService = inject(AuthService);
  fullScreenService = inject(FullScreenService);

  myUser = computed(() => {
    const user = this.myUserService.user();

    if (user) {
      return {...user, color: s_toColor(user.firstname + user.surname)};
    }

    return user;
  });

  switchAdminMode(): void {
    const user = this.myUserService.user()!;
    user.isAdmin = !user.isAdmin;
    this.myUserService.setUser(user);
    this.#lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(user.isAdmin));
  }

  openUserEmailQRCode(): void {
    const user = this.myUserService.user()!;
    this.qrCodeService.openQRCodePage({
      data: user.emailAddress,
      info: 'NAV_USER_SETTINGS_QR_CODE_INFO',
      text: `${user.firstname} ${user.surname}`,
    });
  }
}

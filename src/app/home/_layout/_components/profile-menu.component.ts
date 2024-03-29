import {NgClass, UpperCasePipe} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AppIsLightColorPipe} from '@home-shared/components/color/app-is-light-color.pipe';
import {FullScreenService} from '@home-shared/services/fullscreen.service';
import {QrCodeService} from '@home-shared/services/qr-code.service';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AuthService} from '@shared/services/auth/auth.service';
import {loggerOf, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';
import {s_toColor} from './colors';
import {ThemePickerComponent} from './theme-picker.component';

@Component({
  template: `
    <div ngbDropdown display="dynamic" autoClose="outside">
      <a class="nav-link d-inline-flex align-items-center" id="settingsDropdown" ngbDropdownToggle>
        @if (myUser(); as user) {
          <strong
            style="width: 32px; height: 32px"
            class="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
            [style.background-color]="user.color"
            [ngClass]="{
              'text-white': !(user.color | isLightColor),
              'text-dark': user.color | isLightColor
            }"
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
              <bi name="qr-code" class="ms-1" />
            </a>
          }

          <small>
            <br />
            @if (myUserService.user()?.isAdmin) {
              <b class="clickable" (mousedown)="switchAdminMode()"> {{ 'NAV_USER_SETTINGS_ADMIN' | transloco }} </b>
            }
            @if (myUserService.manualOverwritten() && !myUserService.user()?.isAdmin) {
              <b class="clickable" (mousedown)="switchAdminMode()"> {{ 'NAV_USER_SETTINGS_ADMIN_SWITCH' | transloco }} </b>
            }
          </small>
        </div>
        <div class="dropdown-divider d-none d-xxl-block"></div>

        <theme-picker />

        <button
          type="button"
          ngbDropdownItem
          class="d-none d-xxl-flex gap-2 align-items-center"
          (mousedown)="fullScreenService.setFullScreen(!fullScreenService.isFullScreen()); $event.stopPropagation()"
        >
          @if (fullScreenService.isFullScreen()) {
            <bi name="fullscreen-exit" />
          } @else {
            <bi name="arrows-fullscreen" />
          }
          {{ 'NAV_FULLSCREEN' | transloco }}
        </button>

        <div class="dropdown-divider"></div>
        <a ngbDropdownItem routerLinkActive="active" class="d-flex gap-2 align-items-center" routerLink="/usettings/settings">
          <bi name="gear-wide-connected" />
          {{ 'NAV_USER_SETTINGS' | transloco }}
        </a>
        <a ngbDropdownItem routerLinkActive="active" class="d-flex gap-2 align-items-center" routerLink="/usettings/sessions">
          <bi name="file-lock" />
          {{ 'NAV_USER_SESSIONS' | transloco }}
        </a>
        <button type="button" ngbDropdownItem class="d-flex gap-2 align-items-center" (click)="this.authService.logout()">
          <bi name="box-arrow-left" />
          {{ 'NAV_LOGOUT' | transloco }}
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    BiComponent,
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    RouterLinkActive,
    ThemePickerComponent,
    TranslocoPipe,
    DfxCutPipe,
    UpperCasePipe,
    AppIsLightColorPipe,
    NgClass,
  ],
  selector: 'app-profile-menu',
})
export class ProfileMenuComponent {
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

import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf} from 'dfts-helper';

import {
  AComponent,
  DfxHideIfOffline,
  DfxHideIfOnline,
  DfxHideIfPingSucceeds,
  DfxTrackByModule,
  IsMobileService,
  NgForOr,
  NgSub,
} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, switchMap, tap} from 'rxjs';

import {EnvironmentHelper} from '../_shared/EnvironmentHelper';

import {AuthService} from '../_shared/services/auth/auth.service';
import {MyUserModel} from '../_shared/services/auth/user/my-user.model';
import {MyUserService} from '../_shared/services/auth/user/my-user.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppIconsModule} from '../_shared/ui/icons.module';
import {AppNavbarScrollableComponent, NavItem} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {EventModel} from './events/_models/event.model';
import {EventsService} from './events/_services/events.service';

import {OrganisationModel} from './organisations/_models/organisation.model';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {notNullAndUndefined} from '../_shared/services/abstract-entity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgbDropdownModule,
    DfxTr,
    DfxTrackByModule,
    DfxHideIfOnline,
    DfxHideIfPingSucceeds,
    AppIconsModule,
    FooterModule,
    AppNavbarScrollableComponent,
    NgOptimizedImage,
    NgSub,
    DfxHideIfOffline,
    NgForOr,
    AsyncPipe,
  ],
})
export class HomeComponent extends AComponent {
  environmentType = EnvironmentHelper.getType();
  showEnvironmentType = true;
  lumber = loggerOf('HomeComponent');

  adminModeChanged = false;

  myUser$ = this.myUserService.getUser$().pipe(
    tap((it) => {
      if (it.isAdmin) {
        this.lumber.info('const', 'Admin status detected');
      }
    })
  );
  selectedOrganisation$ = this.organisationsService.getSelected$;
  organisations$ = this.organisationsService.getAll$().pipe(map((organisations) => organisations.slice(0, 5)));

  selectedEvent$ = this.eventsService.getSelected$;

  events$ = this.selectedOrganisation$.pipe(
    filter(notNullAndUndefined),
    switchMap(() => this.eventsService.getAll$())
  );

  navItems$ = combineLatest([this.myUser$, this.selectedEvent$]).pipe(
    map(
      ([myUser, selectedEvent]) =>
        [
          {text: 'NAV_TABLES', routerLink: 'tables', show: !!selectedEvent},
          {text: 'NAV_PRODUCTS', routerLink: 'products', show: !!selectedEvent},
          {text: 'NAV_PRINTERS', routerLink: 'printers', show: !!myUser.isAdmin},
          {text: 'NAV_WAITERS', routerLink: 'waiters', show: true},
          {text: 'NAV_ORDERS', routerLink: 'orders', show: !!selectedEvent},
          {text: 'NAV_STATISTICS', routerLink: 'statistics', show: !!selectedEvent},
        ] as NavItem[]
    )
  );

  isMobile$ = inject(IsMobileService).isMobile$.pipe(
    tap((it) => {
      if (it) {
        const navContent = document.getElementById('navbarSupportedContent');
        if (navContent != null) {
          navContent.style.display = 'none';
        }
      }
    })
  );

  constructor(
    router: Router,
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private qrCodeService: QrCodeService
  ) {
    super();

    this.unsubscribe(
      router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.toggleNav('CLOSE');
        }
      })
    );
  }

  /**
   * document.getElementById('body')?.classList.add('roll');
   *           this.clearTimeout(
   *             window.setTimeout(() => {
   *               document.getElementById('body')?.classList.remove('roll');
   *             }, 4100)
   *           );
   */

  toggleNav(status: 'OPEN' | 'CLOSE' | undefined = undefined): void {
    const collapsable = document.getElementById('navbarSupportedContent');
    if (!collapsable) {
      return;
    }
    if (collapsable.style.display === 'block' || status === 'CLOSE') {
      collapsable.style.display = 'none';
    } else {
      collapsable.style.display = 'block';
    }
  }

  switchAdminMode(): void {
    // if (!this.myUser) {
    //   return;
    // }
    // this.adminModeChanged = !this.adminModeChanged;
    // this.myUser.isAdmin = !this.myUser.isAdmin;
    // this.lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(this.myUser.isAdmin));
    // this.myUserService.manualUserChange.next(this.myUser);
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectEvent(event: EventModel): void {
    this.eventsService.setSelected(event);
  }

  onSelectOrg(org: OrganisationModel): void {
    this.organisationsService.setSelected(org);
    this.eventsService.setSelected(undefined);
  }

  openUserEmailQRCode(user?: MyUserModel): void {
    if (!user) {
      return;
    }

    this.qrCodeService.openQRCodePage({
      data: user.emailAddress,
      info: 'NAV_USER_SETTINGS_QR_CODE_INFO',
      text: `${user.firstname} ${user.surname}`,
    });
  }
}

import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {combineLatest, first, map, startWith, tap} from 'rxjs';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import {loggerOf, s_from} from 'dfts-helper';
import {DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingSucceeds, DfxTrackByModule, IsMobileService, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from '../_shared/EnvironmentHelper';
import {AuthService} from '../_shared/services/auth/auth.service';
import {MyUserModel} from '../_shared/services/auth/user/my-user.model';
import {MyUserService} from '../_shared/services/auth/user/my-user.service';
import {FullScreenService} from '../_shared/services/fullscreen.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppIconsModule} from '../_shared/ui/icons.module';
import {AppNavbarScrollableComponent} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {GetEventOrLocationResponse, GetOrganisationResponse} from '../_shared/waiterrobot-backend';
import {EventsService} from './events/_services/events.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {AppSystemNotificationAlertComponent} from './system-notifications/_components/system-notification-alert.component';
import {ActiveSystemNotificationsService} from './system-notifications/_services/active-system-notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    AsyncPipe,
    AppSystemNotificationAlertComponent,
  ],
})
export class HomeComponent {
  environmentType = EnvironmentHelper.getType();
  showEnvironmentType = true;

  logoUrl = EnvironmentHelper.getLogoUrl();

  lumber = loggerOf('HomeComponent');

  adminModeChanged = false;

  activeSystemNotifications$ = this.activeSystemNotificationsService.getAll$();

  uiControls$ = combineLatest([
    this.fullScreenService.isFullScreen$,
    this.isMobileService.isMobile$.pipe(
      tap((it) => {
        if (it) {
          const navContent = document.getElementById('navbarSupportedContent');
          if (navContent != null) {
            navContent.style.display = 'none';
          }
        }
      }),
    ),
  ]).pipe(map(([isFullScreen, isMobile]) => ({isFullScreen, isMobile})));

  vm$ = combineLatest([
    this.myUserService.getUser$().pipe(
      tap((it) => {
        if (it.isAdmin) {
          this.lumber.info('const', 'Admin status detected');
        }
      }),
    ),
    this.organisationsService.getSelected$,
    this.eventsService.getSelected$,
    this.organisationsService.getAll$().pipe(
      map((it) => it.slice(0, 5)),
      startWith([]),
    ),
    this.eventsService.getAll$().pipe(startWith([])),
  ]).pipe(
    map(([myUser, selectedOrganisation, selectedEvent, organisations, events]) => ({
      myUser,
      selectedOrganisation,
      selectedEvent,
      organisations,
      events,
    })),
  );

  public navItems = [
    {text: 'NAV_TABLES', routerLink: 'tables'},
    {text: 'HOME_PROD_ALL', routerLink: 'products'},
    {text: 'NAV_PRINTERS', routerLink: 'printers'},
    {text: 'NAV_WAITERS', routerLink: 'waiters'},
    {text: 'NAV_ORDERS', routerLink: 'orders'},
    //{text: 'NAV_BILLS', routerLink: 'bills'},
    {text: 'NAV_STATISTICS', routerLink: 'statistics'},
  ];

  constructor(
    router: Router,
    private isMobileService: IsMobileService,
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private qrCodeService: QrCodeService,
    public fullScreenService: FullScreenService,
    public activeSystemNotificationsService: ActiveSystemNotificationsService,
  ) {
    router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.toggleNav('CLOSE');
      }
    });
  }

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
    this.myUserService
      .getUser$()
      .pipe(first())
      .subscribe((user) => {
        this.adminModeChanged = !this.adminModeChanged;
        user.isAdmin = !this.adminModeChanged;
        this.lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(user.isAdmin));
        this.myUserService.manualUserChange.next(user);
      });
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectEvent(event: GetEventOrLocationResponse): void {
    this.eventsService.setSelected(event);
  }

  onSelectOrg(org: GetOrganisationResponse): void {
    this.organisationsService.setSelected(org);
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

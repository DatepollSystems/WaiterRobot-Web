import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf, s_from} from 'dfts-helper';

import {AComponent, DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingSucceeds, DfxTrackByModule, IsMobileService, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {tap} from 'rxjs';

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
  ],
})
export class HomeComponent extends AComponent {
  environmentType = EnvironmentHelper.getType();
  showEnvironmentType = true;

  logoUrl = EnvironmentHelper.getLogoUrl();

  lumber = loggerOf('HomeComponent');

  adminModeChanged = false;
  myUser?: MyUserModel;
  selectedOrganisation?: OrganisationModel;
  allOrgs: OrganisationModel[] = [];
  selectedEvent?: EventModel;
  allEvents: EventModel[] = [];

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

  navItems!: NavItem[];

  constructor(
    router: Router,
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private qrCodeService: QrCodeService
  ) {
    super();
    this.selectedOrganisation = this.organisationsService.getSelected();
    this.allOrgs = this.organisationsService.getAll().slice(0, 5);

    this.unsubscribe(
      this.myUserService.getUser$().subscribe((it) => {
        this.myUser = it;
        this.setNavItems();
        if (it.isAdmin) {
          this.lumber.info('const', 'Admin status detected');
        }
      }),
      this.organisationsService.getSelected$.subscribe((value) => {
        this.selectedOrganisation = value;
        this.onEventInit();
        this.setNavItems();
      }),
      this.organisationsService.allChange.subscribe((it) => (this.allOrgs = it.slice(0, 5)))
    );

    this.onEventInit();

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.toggleNav('CLOSE');
      }
    });

    this.setNavItems();
  }

  onEventInit(): void {
    if (this.selectedOrganisation != null) {
      this.allEvents = this.eventsService.getAll().slice(0, 5);
      this.unsubscribe(
        this.eventsService.allChange.subscribe((events) => {
          this.allEvents = events.slice(0, 5);
        })
      );

      this.selectedEvent = this.eventsService.getSelected();
      this.unsubscribe(
        this.eventsService.getSelected$.subscribe((event) => {
          this.selectedEvent = event;
          this.setNavItems();
        })
      );
    } else {
      this.allEvents = [];
      this.selectedEvent = undefined;
    }
  }

  setNavItems(): void {
    this.navItems = [
      {text: 'NAV_TABLES', routerLink: 'tables', show: !!this.selectedEvent},
      {text: 'NAV_PRODUCTS', routerLink: 'products', show: !!this.selectedEvent},
      {text: 'NAV_PRINTERS', routerLink: 'printers', show: !!this.myUser?.isAdmin},
      {text: 'NAV_WAITERS', routerLink: 'waiters', show: true},
      {text: 'NAV_ORDERS', routerLink: 'orders', show: !!this.selectedEvent},
      {text: 'NAV_STATISTICS', routerLink: 'statistics', show: !!this.selectedEvent},
    ];
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
    if (!this.myUser) {
      return;
    }
    this.adminModeChanged = !this.adminModeChanged;
    this.myUser.isAdmin = !this.myUser.isAdmin;
    this.lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(this.myUser.isAdmin));
    this.myUserService.manualUserChange.next(this.myUser);
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

import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf, s_from} from 'dfts-helper';

import {AComponent, DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingSucceeds, DfxTrackByModule, IsMobileService, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, lastValueFrom, map, startWith, tap} from 'rxjs';

import {EnvironmentHelper} from '../_shared/EnvironmentHelper';

import {AuthService} from '../_shared/services/auth/auth.service';
import {MyUserModel} from '../_shared/services/auth/user/my-user.model';
import {MyUserService} from '../_shared/services/auth/user/my-user.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppIconsModule} from '../_shared/ui/icons.module';
import {AppNavbarScrollableComponent} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {EventsService} from './events/_services/events.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {GetEventOrLocationResponse, GetOrganisationResponse} from '../_shared/waiterrobot-backend';

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
    AsyncPipe,
  ],
})
export class HomeComponent extends AComponent {
  environmentType = EnvironmentHelper.getType();
  showEnvironmentType = true;

  logoUrl = EnvironmentHelper.getLogoUrl();

  lumber = loggerOf('HomeComponent');

  adminModeChanged = false;

  vm$ = combineLatest([
    this.isMobileService.isMobile$.pipe(
      tap((it) => {
        if (it) {
          const navContent = document.getElementById('navbarSupportedContent');
          if (navContent != null) {
            navContent.style.display = 'none';
          }
        }
      })
    ),
    this.myUserService.getUser$().pipe(
      tap((it) => {
        if (it.isAdmin) {
          this.lumber.info('const', 'Admin status detected');
        }
      })
    ),
    this.organisationsService.getSelected$.pipe(
      tap((it) => {
        console.log('selected org', it);
      })
    ),
    this.eventsService.getSelected$.pipe(
      tap((it) => {
        console.log('selected event', it);
      })
    ),
    this.organisationsService.getAll$().pipe(map((it) => it.slice(0, 5))),
    this.eventsService.getAll$().pipe(startWith([])),
  ]).pipe(
    map(([isMobile, myUser, selectedOrganisation, selectedEvent, organisations, events]) => ({
      isMobile,
      myUser,
      selectedOrganisation,
      selectedEvent,
      organisations,
      events,
      navItems: [
        {text: 'NAV_TABLES', routerLink: 'tables', show: !!selectedEvent},
        {text: 'NAV_PRODUCTS', routerLink: 'products', show: !!selectedEvent},
        {text: 'NAV_PRINTERS', routerLink: 'printers', show: !!myUser?.isAdmin},
        {text: 'NAV_WAITERS', routerLink: 'waiters', show: true},
        {text: 'NAV_ORDERS', routerLink: 'orders', show: !!selectedEvent},
        {text: 'NAV_STATISTICS', routerLink: 'statistics', show: !!selectedEvent},
      ],
    }))
  );

  constructor(
    router: Router,
    private isMobileService: IsMobileService,
    private authService: AuthService,
    private myUserService: MyUserService,
    private organisationsService: OrganisationsService,
    private eventsService: EventsService,
    private qrCodeService: QrCodeService
  ) {
    super();

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
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

  async switchAdminMode(): Promise<void> {
    this.adminModeChanged = !this.adminModeChanged;
    const user = await lastValueFrom(this.myUserService.getUser$());
    user.isAdmin = !user.isAdmin;
    this.lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(user.isAdmin));
    this.myUserService.manualUserChange.next(user);
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectEvent(event: GetEventOrLocationResponse): void {
    this.eventsService.setSelected(event);
  }

  onSelectOrg(org: GetOrganisationResponse): void {
    this.organisationsService.setSelected(org);
    // TODO: set event to undefined if organisation change
    //this.eventsService.setSelected(undefined);
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

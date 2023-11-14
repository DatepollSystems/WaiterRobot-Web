import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import {loggerOf, n_from, n_isNumeric, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxHideIfOffline, DfxHideIfOnline, DfxHideIfPingSucceeds, IsMobileService} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from '../_shared/EnvironmentHelper';
import {AuthService} from '../_shared/services/auth/auth.service';
import {MyUserService} from '../_shared/services/auth/user/my-user.service';
import {FullScreenService} from '../_shared/services/fullscreen.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppNavbarScrollableComponent} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {EventsService} from './events/_services/events.service';
import {selectedEventRouteParamKey, SelectedEventService} from './events/_services/selected-event.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {selectedOrganisationRouteParamKey, SelectedOrganisationService} from './organisations/_services/selected-organisation.service';
import {AppSystemNotificationAlertComponent} from './system-notifications/_components/system-notification-alert.component';
import {ActiveSystemNotificationsService} from './system-notifications/_services/active-system-notifications.service';
import {ThemePickerComponent} from './theme.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgbDropdownModule,
    DfxTr,
    DfxHideIfOnline,
    DfxHideIfPingSucceeds,
    BiComponent,
    FooterModule,
    AppNavbarScrollableComponent,
    NgOptimizedImage,
    DfxHideIfOffline,
    AppSystemNotificationAlertComponent,
    ThemePickerComponent,
  ],
})
export class HomeComponent {
  environmentType = EnvironmentHelper.getType();
  logoUrl = EnvironmentHelper.getLogoUrl();

  lumber = loggerOf('HomeComponent');

  authService = inject(AuthService);
  myUserService = inject(MyUserService);
  selectedOrganisationService = inject(SelectedOrganisationService);
  selectedEventService = inject(SelectedEventService);
  activeSystemNotificationsService = inject(ActiveSystemNotificationsService);
  qrCodeService = inject(QrCodeService);
  fullScreenService = inject(FullScreenService);
  isMobileService = inject(IsMobileService);

  showEnvironmentType = true;

  isFullScreen = this.fullScreenService.isFullScreen;
  isMobile = this.isMobileService.isMobile;

  organisations = toSignal(inject(OrganisationsService).getAll$(), {initialValue: []});
  events = toSignal(inject(EventsService).getAll$(), {initialValue: []});

  navItems = computed(() => {
    const selectedOrganisationId = this.selectedOrganisationService.selectedId()
      ? s_from(this.selectedOrganisationService.selectedId())
      : 'organisationId';
    const selectedEventId = this.selectedEventService.selectedId() ? s_from(this.selectedEventService.selectedId()) : 'eventId';
    return [
      {text: 'NAV_WAITERS', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/waiters`},
      {text: 'HOME_TABLES', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/tables`},
      {text: 'HOME_PROD_ALL', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/products`},
      {text: 'NAV_PRINTERS', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/printers`},
      {text: 'NAV_ORDERS', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/orders`},
      {text: 'NAV_BILLS', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/bills`},
      {text: 'NAV_STATISTICS', routerLink: `/o/${selectedOrganisationId}/e/${selectedEventId}/statistics`},
    ];
  });

  constructor() {
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.toggleNav('CLOSE');
        }
      });

    this.isMobileService.isMobile$.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        const navContent = document.getElementById('navbarSupportedContent');
        if (navContent != null) {
          navContent.style.display = 'none';
        }
      }
    });

    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        console.log('read params', params);
        const selectedOrganisation = params.get(selectedOrganisationRouteParamKey);
        if (selectedOrganisation && n_isNumeric(selectedOrganisation)) {
          this.lumber.info('const', 'set selected organisation from route param', selectedOrganisation);
          this.selectedOrganisationService.setSelected(n_from(selectedOrganisation));
        }
        const selectedEvent = params.get(selectedEventRouteParamKey);
        if (selectedEvent && n_isNumeric(selectedEvent)) {
          this.lumber.info('const', 'set selected event from route param', selectedEvent);
          this.selectedEventService.setSelected(n_from(selectedEvent));
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
    const user = this.myUserService.user()!;
    user.isAdmin = !user.isAdmin;
    this.myUserService.setUser(user);
    this.lumber.info('switchAdminMode', 'Admin mode switched to ' + s_from(user.isAdmin));
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

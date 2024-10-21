import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {FullScreenService} from '@home-shared/services/fullscreen.service';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {FooterComponent} from '@shared/ui/footer/footer.component';
import {BiComponent} from 'dfx-bootstrap-icons';
import {injectWindow} from 'dfx-helper';
import {injectNetwork} from 'ngxtension/inject-network';
import {filter, pairwise} from 'rxjs';
import {SelectedEventService} from '../_admin/events/_services/selected-event.service';
import {
  ActiveSystemNotificationsComponent,
  ActiveSystemNotificationsDesktopComponent,
  ActiveSystemNotificationsMobileToggleComponent,
} from './components/active-system-notifications.component';
import {MaintenanceWarningComponent} from './components/maintenance-warning.component';
import {MobileNavComponent} from './components/mobile-nav.component';
import {NavComponent} from './components/nav.component';
import {NetworkOfflineWarningComponent} from './components/network-offline-warning.component';

@Component({
  template: '<router-outlet name="title" />',
  selector: 'home-title',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTitle {}

@Component({
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col pt-3 px-3 bg-body-tertiary position-fixed h-100 nav-container d-none d-xl-block">
          <app-nav id="sidenav" class="d-flex flex-column flex-shrink-0 h-100 overflow-y-scroll overflow-x-hidden" />
        </div>
        <div class="col main-container pt-3">
          <header class="d-flex d-xl-none justify-content-between align-items-center border-bottom pb-2">
            <button type="button" class="btn border-0 d-inline-flex" (click)="openMobileNav()">
              <bi name="list" size="24" />
            </button>

            <app-active-system-mobile-toggle-notifications class="d-block d-md-none" />
          </header>

          <app-active-system-notifications class="d-block d-md-none" disableIgnore />

          <main class="px-lg-3 col-12 px-1 pb-4 pt-2" [class.container-xxxl]="!isFullScreen()">
            @defer (when !networkOnline()) {
              @if (!networkOnline()) {
                <app-network-offline-warning />
              }
            }

            <app-maintenance-warning />

            <div class="d-none d-md-block">
              <app-active-system-desktop-notifications />
            </div>

            @defer (when selectedEvent()?.isDemo) {
              @if (selectedEvent()?.isDemo) {
                <div class="alert alert-danger d-flex align-items-center gap-2 fs-4" role="alert">
                  <div class="d-none d-md-block" style="margin-top: 6px">
                    <bi name="cart-x-fill" size="24px" />
                  </div>
                  {{ 'HOME_START_DEMO_EVENT_WARNING' | transloco }}
                </div>
              }
            }

            <router-outlet />
          </main>

          <app-footer class="col-12" [class.container-xxxl]="!isFullScreen()" />
        </div>
      </div>
    </div>
  `,
  styles: `
    @media screen and (min-width: 1200px) {
      .main-container {
        padding-left: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    main {
      min-height: 95vh;
    }

    .nav-container {
      width: 300px;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    #sidenav::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    #sidenav {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
  `,
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NetworkOfflineWarningComponent,
    MaintenanceWarningComponent,
    ActiveSystemNotificationsComponent,
    RouterOutlet,
    FooterComponent,
    NavComponent,
    BiComponent,
    ActiveSystemNotificationsDesktopComponent,
    ActiveSystemNotificationsMobileToggleComponent,
    HomeTitle,
    TranslocoPipe,
  ],
})
export class HomeLayout {
  isFullScreen = inject(FullScreenService).isFullScreen;
  offcanvasService = inject(NgbOffcanvas);

  selectedEvent = inject(SelectedEventService).selected;

  networkOnline = injectNetwork().online;

  openMobileNav() {
    this.offcanvasService.open(MobileNavComponent, {ariaLabelledBy: 'offcanvas-mobile-nav'});
  }

  constructor() {
    const window = injectWindow();
    const router = inject(Router);

    router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        pairwise(),
      )
      .subscribe(([previousEvent, currentEvent]: [NavigationEnd, NavigationEnd]) => {
        if (this.extractUrlWithoutQueryParams(previousEvent.url) !== this.extractUrlWithoutQueryParams(currentEvent.url)) {
          window?.scrollTo(0, 0);
        }
      });
  }

  private extractUrlWithoutQueryParams(url: string): string {
    return url.split('?')[0];
  }
}

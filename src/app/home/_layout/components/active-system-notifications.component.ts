import {booleanAttribute, Component, inject, input} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';
import {ActiveSystemNotificationsService} from '../services/active-system-notifications.service';
import {AppSystemNotificationAlertComponent} from './system-notification-alert.component';

@Component({
  template: `
    @defer (when activeSystemNotificationsService.getFilteredSystemNotifications().length > 0) {
      @if (activeSystemNotificationsService.getFilteredSystemNotifications().length > 0) {
        <div class="d-flex flex-column gap-3 my-2">
          @for (systemNotification of activeSystemNotificationsService.getFilteredSystemNotifications(); track systemNotification.id) {
            <app-system-notification-alert
              [notification]="systemNotification"
              [disableIgnore]="disableIgnore()"
              (ignore)="activeSystemNotificationsService.ignore($event)"
            />
          }
        </div>
      }
    }
  `,
  standalone: true,
  selector: 'app-active-system-notifications',

  imports: [AppSystemNotificationAlertComponent],
})
export class ActiveSystemNotificationsComponent {
  disableIgnore = input(false, {transform: booleanAttribute});

  activeSystemNotificationsService = inject(ActiveSystemNotificationsService);
}

@Component({
  template: `
    @defer (when activeSystemNotificationsService.getFilteredSystemNotifications().length > 0) {
      @if (activeSystemNotificationsService.allSystemNotifications().length > 0) {
        <div class="d-flex flex-column gap-3 my-2">
          @if (activeSystemNotificationsService.getFilteredSystemNotifications().length > 0) {
            <app-active-system-notifications />
          }
          <div class="d-flex justify-content-end">
            @if (
              activeSystemNotificationsService.ignoredSystemNotifications().length === 0 &&
              activeSystemNotificationsService.getFilteredSystemNotifications().length > 1
            ) {
              <small>
                <bi name="arrows-collapse" class="me-2" />
                <a (mousedown)="activeSystemNotificationsService.ignoreAll()">{{ 'HIDE_ALL' | transloco }}</a>
              </small>
            }
            @if (activeSystemNotificationsService.ignoredSystemNotifications().length > 0) {
              <small>
                <bi name="arrows-expand" class="me-2" />
                <a (mousedown)="activeSystemNotificationsService.resetIgnore()">
                  {{ activeSystemNotificationsService.ignoredSystemNotifications().length }}x Nachricht(en) anzeigen
                </a>
              </small>
            }
          </div>
        </div>
      }
    }
  `,
  standalone: true,
  selector: 'app-active-system-desktop-notifications',

  imports: [BiComponent, TranslocoPipe, ActiveSystemNotificationsComponent],
})
export class ActiveSystemNotificationsDesktopComponent {
  activeSystemNotificationsService = inject(ActiveSystemNotificationsService);
}

@Component({
  template: `
    @if (activeSystemNotificationsService.allSystemNotifications().length > 0) {
      @if (
        activeSystemNotificationsService.ignoredSystemNotifications().length === 0 &&
        activeSystemNotificationsService.getFilteredSystemNotifications().length > 0
      ) {
        <button type="button" class="btn d-inline-flex" (click)="activeSystemNotificationsService.ignoreAll()">
          <bi name="bell-fill" />
          <span class="visually-hidden">{{ 'HIDE_ALL' | transloco }}</span>
        </button>
      }
      @if (activeSystemNotificationsService.ignoredSystemNotifications().length > 0) {
        <button type="button" class="btn d-inline-flex" (click)="activeSystemNotificationsService.resetIgnore()">
          <bi name="bell-slash-fill" />
          <span class="visually-hidden"
            >{{ activeSystemNotificationsService.ignoredSystemNotifications().length }}x Nachricht(en) anzeigen</span
          >
        </button>
      }
    }
  `,
  standalone: true,
  selector: 'app-active-system-mobile-toggle-notifications',

  imports: [BiComponent, TranslocoPipe, ActiveSystemNotificationsComponent],
})
export class ActiveSystemNotificationsMobileToggleComponent {
  activeSystemNotificationsService = inject(ActiveSystemNotificationsService);
}

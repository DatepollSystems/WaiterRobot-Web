import {Component, inject} from '@angular/core';
import {TranslocoPipe} from '@ngneat/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';
import {ActiveSystemNotificationsService} from '../_services/active-system-notifications.service';
import {AppSystemNotificationAlertComponent} from './system-notification-alert.component';

@Component({
  template: `
    @if (activeSystemNotificationsService.allSystemNotifications().length > 0) {
      <div class="d-flex flex-column gap-3 my-2">
        @for (systemNotification of activeSystemNotificationsService.getFilteredSystemNotifications(); track systemNotification.id) {
          <app-system-notification-alert [notification]="systemNotification" (ignore)="activeSystemNotificationsService.ignore($event)" />
        }
        <div class="d-flex justify-content-end">
          @if (activeSystemNotificationsService.ignoredSystemNotifications().length === 0) {
            <small>
              <bi name="arrows-collapse" class="me-2" />
              <a (mousedown)="activeSystemNotificationsService.ignoreAll()">{{ 'HIDE_ALL' | transloco }}</a>
            </small>
          } @else {
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
  `,
  standalone: true,
  selector: 'app-active-system-notifications',

  imports: [BiComponent, AppSystemNotificationAlertComponent, TranslocoPipe],
})
export class ActiveSystemNotificationsComponent {
  activeSystemNotificationsService = inject(ActiveSystemNotificationsService);
}

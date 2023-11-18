import {DatePipe, NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';

import {GetSystemNotificationResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div
      [ngClass]="{
        'alert-light': notification.type === 'NEUTRAL',
        'alert-success': notification.type === 'SUCCESS',
        'alert-danger': notification.type === 'DANGER',
        'alert-warning': notification.type === 'WARNING',
        'alert-info': notification.type === 'INFO'
      }"
      class="alert pt-2 pb-0 mt-3 mb-2"
    >
      <div class="d-flex justify-content-between">
        <div class="d-flex justify-content-start align-items-center gap-2">
          @switch (notification.type) {
            @case ('INFO') {
              <bi name="info-circle-fill" />
            }
            @case ('SUCCESS') {
              <bi name="check-circle-fill" />
            }
            @case ('DANGER') {
              <bi name="exclamation-triangle-fill" />
            }
            @case ('WARNING') {
              <bi name="exclamation-triangle-fill" />
            }
          }

          <h5 class="mt-2">
            {{ notification.title ?? (notification.type | s_lowerCaseAllExceptFirstLetter) }}
            @if (notification.starts || notification.ends) {
              <span>(</span>
            }
            @if (notification.starts) {
              <span
                >{{ notification.starts | date: 'dd.MM.YYYY HH:mm' }}
                @if (notification.starts && notification.ends) {
                  <span> - </span>
                }
                {{ notification.ends | date: getEndsFormatting() }}</span
              >
            }
            @if (notification.starts || notification.ends) {
              <span>)</span>
            }
          </h5>
        </div>
        <button type="button" class="btn-close" aria-label="Close the alert" (click)="ignore.emit(notification.id)"></button>
      </div>
      <div>
        <p>{{ notification.description }}</p>
      </div>
    </div>
  `,
  standalone: true,
  selector: 'app-system-notification-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, DfxLowerCaseExceptFirstLettersPipe, DatePipe],
})
export class AppSystemNotificationAlertComponent {
  @Input({required: true}) notification!: GetSystemNotificationResponse;

  getEndsFormatting(): string {
    const startDate = this.notification.starts ? new Date(this.notification.starts) : undefined;
    const endDate = this.notification.ends ? new Date(this.notification.ends) : undefined;

    if (
      startDate &&
      endDate &&
      startDate.getDate() === endDate.getDate() &&
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return 'HH:mm';
    }
    return 'dd.MM.YYYY HH:mm';
  }

  @Output()
  ignore = new EventEmitter<number>();
}

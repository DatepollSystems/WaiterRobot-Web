import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {GetSystemNotificationResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';

@Component({
  template: `
    <div
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
      [ngClass]="{
        'text-bg-light': type() === 'NEUTRAL',
        'text-bg-success': type() === 'SUCCESS',
        'text-bg-danger': type() === 'DANGER',
        'text-bg-warning': type() === 'WARNING',
        'text-bg-info': type() === 'INFO',
      }"
    >
      @switch (type()) {
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

      <span>{{ type() | s_lowerCaseAllExceptFirstLetter }}</span>
    </div>
  `,
  standalone: true,
  selector: 'app-system-notification-type-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, DfxLowerCaseExceptFirstLettersPipe],
})
export class AppSystemNotificationTypeBadgeComponent {
  type = input.required<GetSystemNotificationResponse['type']>();
}

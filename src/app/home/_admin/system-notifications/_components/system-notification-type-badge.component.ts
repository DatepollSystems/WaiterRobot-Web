import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';

import {GetSystemNotificationResponse} from '../../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div
      [ngClass]="{
        'text-bg-light': type === 'NEUTRAL',
        'text-bg-success': type === 'SUCCESS',
        'text-bg-danger': type === 'DANGER',
        'text-bg-warning': type === 'WARNING',
        'text-bg-info': type === 'INFO'
      }"
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
    >
      @switch (type) {
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

      <span>{{ type | s_lowerCaseAllExceptFirstLetter }}</span>
    </div>
  `,
  standalone: true,
  selector: 'app-system-notification-type-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, DfxLowerCaseExceptFirstLettersPipe],
})
export class AppSystemNotificationTypeBadgeComponent {
  @Input({required: true}) type!: GetSystemNotificationResponse['type'];
}

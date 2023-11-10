import {NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';

import {GetSystemNotificationResponse} from '../../../_shared/waiterrobot-backend';

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
      <ng-container [ngSwitch]="type">
        <bi *ngSwitchCase="'INFO'" name="info-circle-fill" />
        <bi *ngSwitchCase="'SUCCESS'" name="check-circle-fill" />
        <bi *ngSwitchCase="'DANGER'" name="exclamation-triangle-fill" />
        <bi *ngSwitchCase="'WARNING'" name="exclamation-triangle-fill" />
      </ng-container>
      <span>{{ type | s_lowerCaseAllExceptFirstLetter }}</span>
    </div>
  `,
  standalone: true,
  selector: 'app-system-notification-type-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, NgIf, DfxLowerCaseExceptFirstLettersPipe, NgSwitch, NgSwitchCase],
})
export class AppSystemNotificationTypeBadgeComponent {
  @Input({required: true}) type!: GetSystemNotificationResponse['type'];
}

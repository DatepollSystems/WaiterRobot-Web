import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DfxLowerCaseExceptFirstLettersPipe} from 'dfx-helper';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
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
      class='alert pt-2 pb-0'
    >
      <div class='d-flex justify-content-between'>
        <div class='d-flex justify-content-start align-items-center gap-2'>
          <ng-container [ngSwitch]='notification.type'>
            <i-bs *ngSwitchCase='"INFO"' name='info-circle-fill' />
            <i-bs *ngSwitchCase='"SUCCESS"' name='check-circle-fill' />
            <i-bs *ngSwitchCase='"DANGER"' name='exclamation-triangle-fill' />
            <i-bs *ngSwitchCase='"WARNING"' name='exclamation-triangle-fill' />
          </ng-container>
          <h5 class='mt-2'>{{notification.title ?? (notification.type | s_lowerCaseAllExceptFirstLetter) }}</h5>
        </div>
        <div>
          <span *ngIf='notification.starts'>
            {{notification.starts | date : 'dd.MM.YYYY HH:mm:ss'}}
            <span *ngIf='notification.starts && notification.ends'> - </span>
            {{notification.ends | date : 'dd.MM.YYYY HH:mm:ss'}}</span>
        </div>
      </div>
      <div>
        <p>{{notification.description}}</p>
      </div>
    </div>
  `,
  standalone: true,
  selector: 'app-system-notification-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AppIconsModule, NgIf, DfxLowerCaseExceptFirstLettersPipe, NgSwitch, NgSwitchCase, DatePipe],
})
export class AppSystemNotificationAlertComponent {
  @Input({required: true}) notification!: GetSystemNotificationResponse;
}

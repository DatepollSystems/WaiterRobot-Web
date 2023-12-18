import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, HostBinding, TemplateRef} from '@angular/core';

import {NgbToast} from '@ng-bootstrap/ng-bootstrap';

import {NotificationService, Toast} from './notification.service';

@Component({
  template: `
    @for (toast of notificationService.toasts | async; track toast.textOrTpl) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [animation]="true"
        [delay]="toast.delay"
        (hidden)="notificationService.remove(toast)"
      >
        @if (isTemplate(toast.textOrTpl)) {
          <ng-template [ngTemplateOutlet]="$any(toast.textOrTpl)" />
        } @else {
          {{ toast.textOrTpl }}
        }
      </ngb-toast>
    }
  `,
  styles: [':host { position: fixed; bottom: 25px; right: 0; margin: 0.5em; z-index: 1200;}'],
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgbToast, AsyncPipe],
  standalone: true,
})
export class ToastsContainerComponent {
  @HostBinding('class.ngb-toasts') toasts = true;

  constructor(public notificationService: NotificationService) {}

  isTemplate(textOrTpl: Toast['textOrTpl']): textOrTpl is string {
    return textOrTpl instanceof TemplateRef;
  }
}

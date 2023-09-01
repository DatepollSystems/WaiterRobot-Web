import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, HostBinding, TemplateRef} from '@angular/core';

import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';

import {NotificationService} from './notification.service';

@Component({
  template: `
    <ngb-toast
      *ngFor="let toast of notificationService.toasts$ | async"
      [class]="toast.classname"
      [autohide]="true"
      [animation]="true"
      [delay]="toast.delay || 5000"
      (hidden)="notificationService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl" />
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  styles: [':host { position: fixed; bottom: 25px; right: 0; margin: 0.5em; z-index: 1200;}'],
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbToastModule, NgForOf, NgIf, NgTemplateOutlet, AsyncPipe],
  standalone: true,
})
export class ToastsContainerComponent {
  @HostBinding('class.ngb-toasts') toasts = true;

  constructor(public notificationService: NotificationService) {}

  isTemplate(toast: any): boolean {
    return toast.textOrTpl instanceof TemplateRef;
  }
}

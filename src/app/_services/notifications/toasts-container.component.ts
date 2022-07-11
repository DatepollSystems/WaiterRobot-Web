import {Component, HostBinding, TemplateRef} from '@angular/core';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of notificationService.toasts; trackByProperty: 'textOrTpl'"
      [class]="toast.classname"
      [autohide]="true"
      [animation]="true"
      [delay]="toast.delay || 5000"
      (hidden)="notificationService.remove(toast)">
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  styles: [':host { position: fixed; bottom: 25px; right: 0; margin: 0.5em; z-index: 1200;}'],
})
export class ToastsContainerComponent {
  @HostBinding('class.ngb-toasts') toasts = true;

  constructor(public notificationService: NotificationService) {}

  isTemplate(toast: any): boolean {
    return toast.textOrTpl instanceof TemplateRef;
  }
}

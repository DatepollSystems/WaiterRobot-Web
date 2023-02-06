import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {Component, HostBinding, TemplateRef} from '@angular/core';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByProperty} from 'dfx-helper';
import {NotificationService} from './notification.service';

@Component({
  template: `
    <ng-template *ngIf="notificationService.toasts$ | async as toasts">
      <ngb-toast
        *ngFor="let toast of toasts; trackByProperty: 'textOrTpl'"
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
    </ng-template>
  `,
  styles: [':host { position: fixed; bottom: 25px; right: 0; margin: 0.5em; z-index: 1200;}'],
  selector: 'app-toasts',
  imports: [NgbToastModule, NgForOf, DfxTrackByProperty, NgIf, NgTemplateOutlet, AsyncPipe],
  standalone: true,
})
export class ToastsContainerComponent {
  @HostBinding('class.ngb-toasts') toasts = true;

  constructor(public notificationService: NotificationService) {}

  isTemplate(toast: any): boolean {
    return toast.textOrTpl instanceof TemplateRef;
  }
}

import {AsyncPipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {
  CreateSystemNotificationDto,
  GetSystemNotificationResponse,
  UpdateSystemNotificationDto,
} from '../../../_shared/waiterrobot-backend';
import {SystemNotificationsService} from '../_services/system-notifications.service';

import {SystemNotificationEditFormComponent} from './system-notification-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.title }}"</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn
          *ngIf="(activeTab$ | async) === 'DATA'"
          (submit)="form?.submit()"
          [valid]="valid$ | async"
          [editing]="entity !== 'CREATE'"
        />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <ul
        ngbNav
        #nav="ngbNav"
        [activeId]="activeTab$ | async"
        [destroyOnHide]="false"
        class="nav-tabs bg-dark"
        (navChange)="navigateToTab($event.nextId)"
      >
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-system-notification-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [systemNotification]="entity"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-user-edit',
  imports: [
    AsyncPipe,
    NgIf,
    DfxTr,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIconsModule,
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppModelEditSaveBtn,
    SystemNotificationEditFormComponent,
    AppBackButtonComponent,
  ],
  standalone: true,
})
export class SystemNotificationEditComponent extends AbstractModelEditComponent<
  CreateSystemNotificationDto,
  UpdateSystemNotificationDto,
  GetSystemNotificationResponse,
  'DATA'
> {
  defaultTab = 'DATA' as const;

  constructor(systemNotificationsService: SystemNotificationsService) {
    super(systemNotificationsService);
  }
}
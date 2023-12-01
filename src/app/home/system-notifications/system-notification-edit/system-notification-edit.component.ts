import {Component} from '@angular/core';

import {AbstractModelEditComponent} from '../../_shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '../../_shared/form/app-entity-edit.module';
import {injectOnDelete} from '../../_shared/form/edit';
import {injectOnSubmit} from '../../../_shared/form';
import {GetSystemNotificationResponse} from '../../../_shared/waiterrobot-backend';
import {SystemNotificationsService} from '../_services/system-notifications.service';
import {SystemNotificationEditFormComponent} from './system-notification-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.title }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <div *isEditing="entity">
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <app-system-notification-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          [systemNotification]="entity"
        />
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-user-edit',
  imports: [AppEntityEditModule, SystemNotificationEditFormComponent],
  standalone: true,
})
export class SystemNotificationEditComponent extends AbstractModelEditComponent<GetSystemNotificationResponse> {
  onDelete = injectOnDelete((it: number) => this.systemNotificationsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.systemNotificationsService});

  constructor(private systemNotificationsService: SystemNotificationsService) {
    super(systemNotificationsService);
  }
}

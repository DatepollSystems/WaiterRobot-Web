import {Component} from '@angular/core';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {injectEditDelete} from '../../../_shared/ui/form/tab';
import {
  CreateSystemNotificationDto,
  GetSystemNotificationResponse,
  UpdateSystemNotificationDto,
} from '../../../_shared/waiterrobot-backend';
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
          (submitUpdate)="submit('UPDATE', $event)"
          (submitCreate)="submit('CREATE', $event)"
          [systemNotification]="entity"
        />
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-user-edit',
  imports: [AppFormModule, SystemNotificationEditFormComponent],
  standalone: true,
})
export class SystemNotificationEditComponent extends AbstractModelEditComponent<
  CreateSystemNotificationDto,
  UpdateSystemNotificationDto,
  GetSystemNotificationResponse
> {
  constructor(private systemNotificationsService: SystemNotificationsService) {
    super(systemNotificationsService);
  }

  onDelete = injectEditDelete((it: number) => this.systemNotificationsService.delete$(it).subscribe());
}

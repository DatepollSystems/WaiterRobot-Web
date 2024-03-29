import {Component} from '@angular/core';

import {injectOnSubmit} from '../../../../_shared/form';
import {GetSystemNotificationResponse} from '../../../../_shared/waiterrobot-backend';
import {AbstractModelEditComponent} from '../../../_shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '../../../_shared/form/app-entity-edit.module';
import {injectOnDelete} from '../../../_shared/form/edit';
import {SystemNotificationsService} from '../_services/system-notifications.service';
import {SystemNotificationEditFormComponent} from './system-notification-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} "{{ entity.title }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <div *isEditing="entity">
            <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <app-system-notification-edit-form
          #form
          [systemNotification]="entity"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
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

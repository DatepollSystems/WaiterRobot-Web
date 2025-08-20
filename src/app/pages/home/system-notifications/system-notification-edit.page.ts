import {Component, inject} from '@angular/core';

import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {SystemNotificationEditForm} from '../../../forms/system-notification-edit-form';
import {SystemNotificationsService} from '../../../services/system-notifications.service';
import {injectOnSubmit} from '../../../util/form';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} "{{ entity.title }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <div *isEditing="entity">
            <button class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)" type="button">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <system-notification-edit-form
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
  selector: 'system-notification-edit-page',
  imports: [AppEntityEditModule, SystemNotificationEditForm],
})
export class SystemNotificationEditPage {
  #systemNotificationsService = inject(SystemNotificationsService);

  entity = injectEditEntity({
    get$: (id) => this.#systemNotificationsService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#systemNotificationsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.#systemNotificationsService});
}

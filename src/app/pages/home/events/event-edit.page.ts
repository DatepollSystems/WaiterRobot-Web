import {ChangeDetectionStrategy, Component, inject, numberAttribute} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {injectQueryParams} from 'ngxtension/inject-query-params';

import {EventEditForm} from '../../../forms/event-edit-form';
import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {EventsService} from '../../../services/events.service';
import {injectOnSubmit} from '../../../util/form';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)" type="button">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>
          </ng-container>
        </scrollable-toolbar>

        <hr />

        <event-edit-form
          [selectedOrganisationId]="entity !== 'CREATE' ? entity.organisationId : selectedOrganisationId()"
          [event]="entity"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'event-edit-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, EventEditForm],
})
export class EventEditPage {
  #eventsService = inject(EventsService);

  entity = injectEditEntity({
    get$: (id) => this.#eventsService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#eventsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.#eventsService});

  selectedOrganisationId = injectQueryParams('orgId', {
    transform: numberAttribute,
  });
}

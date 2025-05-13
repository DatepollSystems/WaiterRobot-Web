import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';

import {SelectedEventService} from '@shared/services';

import {EventLicensesStore} from '../../_services/event-licences.store';
import {AppLicenseEditFormComponent} from './license-edit-form.component';

@Component({
  template: `
    @if (eventLicenseStore.license(); as entity) {
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

        <app-license-edit-form
          [selectedEventId]="entity !== 'CREATE' ? entity.eventId : selectedEventService.selectedId()"
          [license]="entity"
        />
        <!--          (submitUpdate)="onSubmit('UPDATE', $event)"-->
        <!--          (submitCreate)="onSubmit('CREATE', $event)"-->
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-event-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, AppLicenseEditFormComponent],
})
export class LicenseEditComponent {
  eventLicenseStore = inject(EventLicensesStore);

  selectedEventService = inject(SelectedEventService);

  onDelete = injectOnDelete((it: number) => this.eventLicenseStore.delete(it));
  // onSubmit = injectOnSubmit({entityService: this.#eventsService});
}

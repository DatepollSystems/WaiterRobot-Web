import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {injectParams} from 'ngxtension/inject-params';

import {AppLicenseEditFormComponent} from '../../../components/settings/licenses/license-edit-form.component';
import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectOnDelete} from '../../../forms/form/edit';
import {EventLicencesStore} from '../../../services/event-licences.store';
import {SelectedEventService} from '../../../services/selected-event.service';

@Component({
  template: `
    @if (eventLicenseStore.license(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">
          {{ 'EDIT_2' | transloco }} {{ entity.start | date: 'yyyy.MM.DD HH:mm:ss' }} {{ entity.end | date: 'yyyy.MM.DD HH:mm:ss' }}
        </h1>
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
          [selectedEventId]="entity !== 'CREATE' ? eventLicenseStore.eventId() : selectedEventService.selectedId()"
          [license]="entity"
          (submitUpdate)="eventLicenseStore.update($event)"
          (submitCreate)="eventLicenseStore.create($event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-event-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, AppLicenseEditFormComponent, DatePipe],
})
export class LicenseEditPage {
  eventLicenseStore = inject(EventLicencesStore);

  selectedEventService = inject(SelectedEventService);

  onDelete = injectOnDelete((it: number) => this.eventLicenseStore.delete(it));

  constructor() {
    const id = injectParams('id');
    this.eventLicenseStore.loadSingle(id);
  }
}

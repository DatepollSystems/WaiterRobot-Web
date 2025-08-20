import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {AppUnpaidReasonEditFormComponent} from '../../../forms/unpaid-reason-edit-form.component';
import {SelectedEventService} from '../../../services/selected-event.service';
import {UnpaidReasonsService} from '../../../services/unpaid-reasons.service';
import {injectOnSubmit} from '../../../util/form';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.reason }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          @if (entity !== 'CREATE' && !entity.isGlobal) {
            <ng-container *isEditing="entity">
              <div>
                <button class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)" type="button">
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </div>
            </ng-container>
          }
        </scrollable-toolbar>

        <hr />

        <app-unpaid-reason-edit-form
          #form
          [selectedEventId]="selectedEventId()!"
          [formDisabled]="entity !== 'CREATE' && entity.isGlobal"
          [unpaidReason]="entity"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'unpaid-reason-edit-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, AppUnpaidReasonEditFormComponent],
})
export class UnpaidReasonEditPage {
  #unpaidReasonsService = inject(UnpaidReasonsService);

  entity = injectEditEntity({
    get$: (id) => this.#unpaidReasonsService.getSingle$(id),
  });
  onDelete = injectOnDelete((it: number) => this.#unpaidReasonsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.#unpaidReasonsService});

  selectedEventId = inject(SelectedEventService).selectedId;
}

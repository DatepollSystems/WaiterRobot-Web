import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AppSelectableBtnComponent} from '@home-shared/components/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';

import {injectOnSubmit} from '@shared/form';
import {GetBillUnpaidReasonResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {UnpaidReasonsService} from '../_services/unpaid-reasons.service';
import {AppUnpaidReasonEditFormComponent} from './unpaid-reason-edit-form.component';

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
                <button type="button" class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
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
  selector: 'app-event-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, AppSelectableBtnComponent, AppUnpaidReasonEditFormComponent],
})
export class UnpaidReasonEditComponent extends AbstractModelEditComponent<GetBillUnpaidReasonResponse> {
  onDelete = injectOnDelete((it: number) => this.unpaidReasonsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.unpaidReasonsService});

  selectedEventId = inject(SelectedEventService).selectedId;

  constructor(private unpaidReasonsService: UnpaidReasonsService) {
    super(unpaidReasonsService);
  }
}

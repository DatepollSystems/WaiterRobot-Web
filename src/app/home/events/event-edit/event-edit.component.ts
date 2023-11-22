import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';

import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppSelectableBtnComponent} from '../../../_shared/ui/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppEntityEditModule} from '../../../_shared/ui/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '../../../_shared/ui/form/edit';
import {injectOnSubmit} from '../../../_shared/ui/form/form';
import {GetEventOrLocationResponse} from '../../../_shared/waiterrobot-backend';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {EventsService} from '../_services/events.service';
import {SelectedEventService} from '../_services/selected-event.service';
import {AppEventEditFormComponent} from './event-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            @if (myUser()?.isAdmin) {
              <div>
                <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                  <bi name="trash" />
                  {{ 'DELETE' | tr }}
                </button>
              </div>
            }
            <div>
              <selectable-button
                class="my-2"
                [entityId]="entity.id"
                [selectedId]="selectedEventService.selectedId()"
                (selectedChange)="selectedEventService.setSelected($event)"
              />
            </div>
          </ng-container>
        </scrollable-toolbar>

        <hr />

        <app-event-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          [selectedOrganisationId]="selectedOrganisationId()!"
          [formDisabled]="!myUser()?.isAdmin"
          [event]="entity"
        />
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-event-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, BiComponent, AppSelectableBtnComponent, AppEventEditFormComponent],
})
export class EventEditComponent extends AbstractModelEditComponent<GetEventOrLocationResponse> {
  onDelete = injectOnDelete((it: number) => this.eventsService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['organisationId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.eventsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  myUser = inject(MyUserService).user;
  selectedEventService = inject(SelectedEventService);
  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;

  constructor(private eventsService: EventsService) {
    super(eventsService);
  }
}

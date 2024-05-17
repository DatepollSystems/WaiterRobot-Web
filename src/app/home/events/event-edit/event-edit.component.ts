import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AppSelectableBtnComponent} from '@home-shared/components/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';
import {MyUserService} from '@home-shared/services/user/my-user.service';

import {injectOnSubmit} from '@shared/form';
import {GetEventOrLocationResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {EventsService} from '../_services/events.service';
import {SelectedEventService} from '../_services/selected-event.service';
import {AppEventEditFormComponent} from './event-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            @if (myUser()?.isAdmin) {
              <div>
                <button type="button" class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
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
          [selectedOrganisationId]="selectedOrganisationId()!"
          [formDisabled]="!myUser()?.isAdmin"
          [event]="entity"
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
  imports: [AppEntityEditModule, BiComponent, AppSelectableBtnComponent, AppEventEditFormComponent],
})
export class EventEditComponent extends AbstractModelEditComponent<GetEventOrLocationResponse> {
  onDelete = injectOnDelete((it: number) => this.eventsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.eventsService});

  myUser = inject(MyUserService).user;
  selectedEventService = inject(SelectedEventService);
  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;

  constructor(private eventsService: EventsService) {
    super(eventsService);
  }
}

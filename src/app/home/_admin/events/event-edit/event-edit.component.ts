import {ChangeDetectionStrategy, Component, inject, numberAttribute} from '@angular/core';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';
import {MyUserService} from '@home-shared/services/user/my-user.service';

import {injectOnSubmit} from '@shared/form';
import {GetEventOrLocationResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {injectQueryParams} from 'ngxtension/inject-query-params';
import {EventsService} from '../_services/events.service';
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
                <button type="button" class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)">
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </div>
            }
          </ng-container>
        </scrollable-toolbar>

        <hr />

        <app-event-edit-form
          #form
          [selectedOrganisationId]="entity !== 'CREATE' ? entity.organisationId : selectedOrganisationId()"
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
  imports: [AppEntityEditModule, BiComponent, AppEventEditFormComponent],
})
export class EventEditComponent extends AbstractModelEditComponent<GetEventOrLocationResponse> {
  onDelete = injectOnDelete((it: number) => this.eventsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.eventsService});

  myUser = inject(MyUserService).user;
  selectedOrganisationId = injectQueryParams('orgId', {transform: numberAttribute});

  constructor(private eventsService: EventsService) {
    super(eventsService);
  }
}

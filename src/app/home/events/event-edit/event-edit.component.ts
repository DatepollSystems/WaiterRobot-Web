import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {NgbInputDatepicker, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppSelectableBtnComponent} from '../../../_shared/ui/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateEventOrLocationDto, GetEventOrLocationResponse, UpdateEventOrLocationDto} from '../../../_shared/waiterrobot-backend';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {EventsService} from '../_services/events.service';
import {SelectedEventService} from '../_services/selected-event.service';
import {AppEventEditFormComponent} from './event-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <scrollable-toolbar>
        <back-button />

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />

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

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-event-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [selectedOrganisationId]="selectedOrganisationId()!"
              [formDisabled]="!myUser()!.isAdmin"
              [event]="entity"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-event-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    NgbInputDatepicker,
    NgbNavModule,
    DfxTr,
    AppFormModule,
    BiComponent,
    AppSelectableBtnComponent,
    AppEventEditFormComponent,
  ],
})
export class EventEditComponent extends AbstractModelEditComponent<
  CreateEventOrLocationDto,
  UpdateEventOrLocationDto,
  GetEventOrLocationResponse,
  'DATA'
> {
  override continuousUsePropertyNames = ['organisationId'];

  defaultTab = 'DATA' as const;

  myUser = inject(MyUserService).user;
  selectedEventService = inject(SelectedEventService);
  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;

  constructor(public eventsService: EventsService) {
    super(eventsService);
  }
}

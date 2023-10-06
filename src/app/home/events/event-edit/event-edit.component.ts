import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {combineLatest, filter, map} from 'rxjs';

import {NgbInputDatepicker, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {notNullAndUndefined} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppSelectableBtnComponent} from '../../../_shared/ui/button/app-selectable-btn.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {CreateEventOrLocationDto, GetEventOrLocationResponse, UpdateEventOrLocationDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {EventsService} from '../_services/events.service';
import {AppEventEditFormComponent} from './event-edit-form.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <back-button />

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div *ngIf="(myUser$ | async)?.isAdmin">
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
          <div>
            <selectable-button class="my-2" [entity]="entity" [selectedEntityService]="eventsService" placement="top" />
          </div>
        </ng-container>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-event-edit-form
              *ngIf="vm$ | async as vm"
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [selectedOrganisationId]="vm.selectedOrganisation.id"
              [formDisabled]="!vm.myUser.isAdmin"
              [event]="entity"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
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
    AppIconsModule,
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

  myUser$ = inject(MyUserService).getUser$();

  selectedOrganisation = inject(OrganisationsService).getSelected$;

  vm$ = combineLatest([this.myUser$, this.selectedOrganisation.pipe(filter(notNullAndUndefined))]).pipe(
    map(([myUser, selectedOrganisation]) => ({myUser, selectedOrganisation})),
  );

  constructor(public eventsService: EventsService) {
    super(eventsService);
  }
}

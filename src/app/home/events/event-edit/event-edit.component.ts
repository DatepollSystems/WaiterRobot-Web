import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgbInputDatepicker, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {notNullAndUndefined} from 'dfts-helper';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map} from 'rxjs';
import {MyUserService} from '../../../_shared/services/auth/user/my-user.service';
import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../../_shared/ui/app-selectable-button.component';
import {BtnWaiterCreateQrCodeComponent} from '../../../_shared/ui/btn-waiter-create-qr-code.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateEventOrLocationDto, GetEventOrLocationResponse, UpdateEventOrLocationDto} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {EventsService} from '../_services/events.service';
import {AppEventEditFormComponent} from './event-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <back-button />

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div *ngIf="(myUser$ | async)?.isAdmin">
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
          <div>
            <!--suppress TypeScriptValidateTypes -->
            <selectable-button class="my-2" [entity]="entity" [selectedEntityService]="eventsService" placement="top" />
          </div>
          <div>
            <app-btn-waiter-create-qrcode [token]="entity.waiterCreateToken" />
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
    NgSub,
    NgIf,
    NgbNav,
    NgbNavLink,
    NgbNavItem,
    NgbNavContent,
    NgbInputDatepicker,
    NgbNavOutlet,
    DfxTr,
    AppSpinnerRowComponent,
    BtnWaiterCreateQrCodeComponent,
    AppBtnToolbarComponent,
    AppIconsModule,
    AppSelectableButtonComponent,
    AsyncPipe,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppEventEditFormComponent,
    AppModelEditSaveBtn,
    AppBackButtonComponent,
  ],
})
export class EventEditComponent extends AbstractModelEditComponent<
  CreateEventOrLocationDto,
  UpdateEventOrLocationDto,
  GetEventOrLocationResponse,
  'DATA'
> {
  defaultTab = 'DATA' as const;

  myUser$ = inject(MyUserService).getUser$();

  selectedOrganisation = inject(OrganisationsService).getSelected$;

  vm$ = combineLatest([this.myUser$, this.selectedOrganisation.pipe(filter(notNullAndUndefined))]).pipe(
    map(([myUser, selectedOrganisation]) => ({myUser, selectedOrganisation}))
  );

  constructor(public eventsService: EventsService) {
    super(eventsService);
  }
}

import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbModalRef, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {n_from, n_isNumeric} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, startWith} from 'rxjs';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponentV2} from '../../../_shared/ui/form/abstract-model-edit.component-v2';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateWaiterDto, GetWaiterResponse, UpdateWaiterDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {WaitersService} from '../_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from '../btn-waiter-sign-in-qr-code.component';
import {AppProductEditFormComponent} from './waiter-edit-form.component';
import {WaiterSessionsComponent} from './waiter-sessions.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack('/home/waiters/organisation')">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditing="entity">
          <div>
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>

          <app-btn-waiter-signin-qrcode [token]="entity.signInToken" />
        </ng-container>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-waiter-edit-form
              *ngIf="vm$ | async as vm"
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [waiter]="entity"
              [selectedOrganisationId]="vm.selectedOrganisation?.id"
              [selectedEventId]="vm.selectedEvent?.id"
              [events]="vm.events"
            />
          </ng-template>
        </li>
        <li [ngbNavItem]="'SESSIONS'" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'NAV_USER_SESSIONS' | tr }}</a>
          <ng-template ngbNavContent>
            <app-waiter-sessions />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-waiter-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    DfxTr,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    WaiterSessionsComponent,
    AppIconsModule,
    AppBtnToolbarComponent,
    BtnWaiterSignInQrCodeComponent,
    AppIsEditingDirective,
    AppSpinnerRowComponent,
    AppIsCreatingDirective,
    AppModelEditSaveBtn,
    AppProductEditFormComponent,
  ],
})
export class WaiterEditComponent extends AbstractModelEditComponentV2<
  CreateWaiterDto,
  UpdateWaiterDto,
  GetWaiterResponse,
  'DATA' | 'SESSIONS'
> {
  defaultTab = 'DATA' as const;
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = ['SESSIONS' as const];

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      startWith(undefined)
    ),
    this.organisationsService.getSelected$,
    this.eventsService.getSelected$,
    this.eventsService.getAll$(),
  ]).pipe(
    map(([selectedWaiterId, selectedOrganisation, selectedEvent, events]) => ({
      selectedWaiterId,
      selectedOrganisation,
      selectedEvent,
      events,
    }))
  );

  qrCodeModal: NgbModalRef | undefined;

  constructor(waitersService: WaitersService, public eventsService: EventsService, private organisationsService: OrganisationsService) {
    super(waitersService);
  }
}

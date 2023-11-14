import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {combineLatest, filter, map, shareReplay, startWith, switchMap} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {n_from, n_isNumeric} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateWaiterDto, GetWaiterResponse, UpdateWaiterDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {WaitersService} from '../_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from '../btn-waiter-sign-in-qr-code.component';
import {AppProductEditFormComponent} from './waiter-edit-form.component';
import {WaiterEditOrderProductsComponent} from './waiter-edit-order-products.component';
import {WaiterSessionsComponent} from './waiter-sessions.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <scrollable-toolbar>
        <back-button />
        <app-model-edit-save-btn
          *ngIf="(activeTab$ | async) === 'DATA'"
          (submit)="form?.submit()"
          [valid]="valid()"
          [editing]="entity !== 'CREATE'"
        />

        <ng-container *isEditing="entity">
          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>

          <app-btn-waiter-signin-qrcode [token]="entity.signInToken" />
        </ng-container>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </scrollable-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
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
              [selectedOrganisationId]="selectedOrganisationId()!"
              [selectedEvent]="vm.selectedEvent"
              [events]="vm.events"
            />
          </ng-template>
        </li>
        <li [ngbNavItem]="'ORDERS'" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'NAV_ORDERS' | tr }}</a>
          <ng-template ngbNavContent>
            <app-waiter-edit-order-products />
          </ng-template>
        </li>
        <li [ngbNavItem]="'SESSIONS'" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'NAV_USER_SESSIONS' | tr }}</a>
          <ng-template ngbNavContent>
            <app-waiter-sessions />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
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
    NgbNavModule,
    BiComponent,
    AppFormModule,
    AppProductEditFormComponent,
    BtnWaiterSignInQrCodeComponent,
    AppContinuesCreationSwitchComponent,
    WaiterSessionsComponent,
    WaiterEditOrderProductsComponent,
  ],
})
export class WaiterEditComponent extends AbstractModelEditComponent<
  CreateWaiterDto,
  UpdateWaiterDto,
  GetWaiterResponse,
  'DATA' | 'SESSIONS' | 'ORDERS'
> {
  defaultTab = 'DATA' as const;
  override onlyEditingTabs = ['SESSIONS' as const, 'ORDERS' as const];
  continuousUsePropertyNames = ['activated', 'eventIds', 'organisationId'];

  events = this.eventsService.getAll$().pipe(shareReplay(1));

  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      startWith(undefined),
    ),
    this.eventsService.getSelected$,
    this.route.queryParams.pipe(
      map((params) => params.event as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      switchMap((id) => this.events.pipe(map((events) => events.find((event) => event.id === id)))),
      startWith(undefined),
    ),
    this.events,
  ]).pipe(
    map(([selectedWaiterId, selectedEvent, queryEvent, events]) => ({
      selectedWaiterId,
      selectedEvent: queryEvent ?? selectedEvent,
      events,
    })),
  );

  constructor(
    waitersService: WaitersService,
    public eventsService: EventsService,
    private organisationsService: OrganisationsService,
  ) {
    super(waitersService);
  }
}

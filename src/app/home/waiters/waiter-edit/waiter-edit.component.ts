import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

import {combineLatest, filter, map, shareReplay, startWith, tap} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {n_from, n_isNumeric} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateWaiterDto, GetWaiterResponse, UpdateWaiterDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {WaitersService} from '../_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from '../btn-waiter-sign-in-qr-code.component';
import {AppProductEditFormComponent} from './waiter-edit-form.component';
import {WaiterEditOrderProductsComponent} from './waiter-edit-order-products.component';
import {WaiterSessionsComponent} from './waiter-sessions.component';
import {SelectedEventService} from '../../events/_services/selected-event.service';

@Component({
  template: `
    @if (entity$ | async; as entity) {
      <div>
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />
          @if ((activeTab$ | async) === 'DATA') {
            <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />
          }

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
                #form
                (formValid)="setValid($event)"
                (submitUpdate)="submit('UPDATE', $event)"
                (submitCreate)="submit('CREATE', $event)"
                [waiter]="entity"
                [selectedOrganisationId]="selectedOrganisationId()!"
                [selectedEvent]="selectedEvent()"
                [events]="events()"
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
    } @else {
      <app-spinner-row />
    }
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

  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;
  private allEvents$ = inject(EventsService).getAll$().pipe(shareReplay(1));

  selectedEvent = toSignal(
    combineLatest([
      combineLatest([
        this.allEvents$,
        this.route.queryParams.pipe(
          takeUntilDestroyed(),
          map((params) => params.event as string),
          filter(n_isNumeric),
          map((id) => n_from(id)),
          tap((it) => this.lumber.info('selectedEvent', 'found in query', it)),
          startWith(undefined),
        ),
      ]).pipe(
        map(([allEvents, eventId]) => allEvents.find((event) => event.id === eventId)),
        tap((it) => this.lumber.info('selectedEvent', 'found in event array', it)),
      ),
      inject(SelectedEventService).selected$,
    ]).pipe(map(([queryEvent, selectedEvent]) => queryEvent ?? selectedEvent)),
  );

  events = toSignal(this.allEvents$, {initialValue: []});

  constructor(waitersService: WaitersService) {
    super(waitersService);
  }
}

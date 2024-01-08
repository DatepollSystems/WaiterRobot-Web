import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {combineLatest, filter, map, shareReplay, startWith, tap} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {loggerOf, n_from, n_isNumeric} from 'dfts-helper';

import {injectOnSubmit} from '../../../_shared/form';
import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelEditComponent} from '../../_shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../_shared/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '../../_shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete, injectTabControls} from '../../_shared/form/edit';
import {EventsService} from '../../events/_services/events.service';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';
import {WaitersService} from '../_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from '../btn-waiter-sign-in-qr-code.component';
import {AppWaiterEditFormComponent} from './waiter-edit-form.component';
import {WaiterSessionsComponent} from './waiter-sessions.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>

            <app-btn-waiter-signin-qrcode [token]="entity.signInToken" />

            <div>
              <a
                class="btn btn-sm btn-outline-secondary text-body-emphasis"
                routerLink="../../orders"
                [queryParams]="{waiterIds: entity.id}"
              >
                <bi name="stack" />
                {{ 'NAV_ORDERS' | tr }}
              </a>
            </div>
            <div>
              <a
                class="btn btn-sm btn-outline-secondary text-body-emphasis"
                routerLink="../../bills"
                [queryParams]="{waiterIds: entity.id}"
              >
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | tr }}
              </a>
            </div>
          </ng-container>

          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        <ul
          ngbNav
          #nav="ngbNav"
          [activeId]="tabControls.activeTab()"
          class="nav-tabs"
          (navChange)="tabControls.navigateToTab($event.nextId)"
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <app-waiter-edit-form
                #form
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
                [waiter]="entity"
                [selectedOrganisationId]="selectedOrganisationId()!"
                [selectedEvent]="selectedEvent()"
                [events]="events()"
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

        <div [ngbNavOutlet]="nav"></div>
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-waiter-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbNavModule,
    AppEntityEditModule,
    AppWaiterEditFormComponent,
    BtnWaiterSignInQrCodeComponent,
    AppContinuesCreationSwitchComponent,
    WaiterSessionsComponent,
    RouterLink,
  ],
})
export class WaiterEditComponent extends AbstractModelEditComponent<GetWaiterResponse> {
  onDelete = injectOnDelete((it: number) => this.waitersService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['activated', 'eventIds', 'organisationId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.waitersService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });
  tabControls = injectTabControls<'DATA' | 'SESSIONS'>({
    onlyEditingTabs: ['SESSIONS'],
    defaultTab: 'DATA',
    isCreating: computed(() => this.entity() === 'CREATE'),
  });

  lumber = loggerOf('WaiterEditComponent');

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

  constructor(private waitersService: WaitersService) {
    super(waitersService);
  }
}

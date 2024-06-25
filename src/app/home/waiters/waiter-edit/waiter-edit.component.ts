import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete, injectTabControls} from '@home-shared/form/edit';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {injectOnSubmit} from '@shared/form';
import {GetWaiterResponse} from '@shared/waiterrobot-backend';

import {loggerOf, n_from, n_isNumeric} from 'dfts-helper';

import {combineLatest, filter, map, shareReplay, startWith, tap} from 'rxjs';
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
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <app-btn-waiter-signin-qrcode [token]="entity.signInToken" />

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../orders" [queryParams]="{waiterIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../bills" [queryParams]="{waiterIds: entity.id}">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | transloco }}
              </a>
            </div>
          </ng-container>

          <div *isCreating="entity" class="d-flex align-items-center">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        <ul
          #nav="ngbNav"
          ngbNav
          class="nav-tabs"
          [activeId]="tabControls.activeTab()"
          (navChange)="tabControls.navigateToTab($event.nextId)"
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | transloco }}</a>
            <ng-template ngbNavContent>
              <app-waiter-edit-form
                #form
                [waiter]="entity"
                [selectedOrganisationId]="selectedOrganisationId()!"
                [selectedEvent]="selectedEvent()"
                [events]="events()"
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
              />
            </ng-template>
          </li>
          <li *isEditing="entity" [ngbNavItem]="'SESSIONS'" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'NAV_USER_SESSIONS' | transloco }}</a>
            <ng-template ngbNavContent>
              <app-waiter-sessions />
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav"></div>
      </div>
    } @else {
      <app-edit-placeholder />
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

import {ChangeDetectionStrategy, Component, computed, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {combineLatest, filter, map, shareReplay, startWith, tap} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf, n_from, n_isNumeric} from 'dfts-helper';

import {UnknownModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectEditEntity, injectOnDelete, injectTabControls} from '@home-shared/form/edit';

import {injectOnSubmit} from '@shared/form';
import {SelectedEventService} from '@shared/services/selected-event.service';
import {SelectedOrganisationService} from '@shared/services/selected-organisation.service';

import {EventsService} from '../../_admin/events/_services/events.service';
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
              <button class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)" type="button">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <app-btn-waiter-signin-qrcode [token]="entity.signInToken" />

            <div>
              <a class="btn btn-sm btn-secondary" [queryParams]="{waiterIds: entity.id}" routerLink="../../../orders">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" [queryParams]="{waiterIds: entity.id}" routerLink="../../../bills">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | transloco }}
              </a>
            </div>
          </ng-container>

          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        <ul
          class="nav-tabs"
          #nav="ngbNav"
          [activeId]="tabControls.activeTab()"
          (navChange)="tabControls.navigateToTab($event.nextId)"
          ngbNav
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
export class WaiterEditComponent {
  #route = inject(ActivatedRoute);
  #waitersService = inject(WaitersService);

  form = viewChild<UnknownModelEditFormComponent>('form');

  entity = injectEditEntity({
    get$: (id) => this.#waitersService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#waitersService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['activated', 'eventIds', 'organisationId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.#waitersService,
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
        this.#route.queryParams.pipe(
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
}

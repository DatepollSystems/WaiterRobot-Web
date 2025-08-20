import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject, signal, viewChild} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {forkJoin, of, switchMap, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownItem, NgbDropdownModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {n_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe, StopPropagationDirective} from 'dfx-helper';
import {injectParams} from 'ngxtension/inject-params';

import {APIType} from '../../../api';
import {ActionDropdownComponent} from '../../../components/action-dropdown.component';
import {BlankslateComponent} from '../../../components/blankslate.component';
import {BtnWaiterCreateQrCodeComponent} from '../../../components/button/app-waiter-create-qr-code-btn.component';
import {AppProgressBarComponent} from '../../../components/loading/app-progress-bar.component';
import {ScrollableToolbarComponent} from '../../../components/scrollable-toolbar.component';
import {AppActivatedPipe} from '../../../pipes/app-activated.pipe';
import {ShareableLinkPipe, WaiterAuthLinkPipe} from '../../../pipes/wr-links.pipe';
import {EventsService} from '../../../services/events.service';
import {QrCodeService} from '../../../services/qr-code.service';
import {SelectedEventService} from '../../../services/selected-event.service';
import {OrganisationWaitersService} from '../../../services/waiters/organisation-waiters.service';
import {WaitersService} from '../../../services/waiters/waiters.service';
import {ListFilterComponent, injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '../../../util/list';
import {mapName} from '../../../util/name-map';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <a class="btn btn-sm btn-success" [queryParams]="{event: event()?.id ?? selectedEvent()?.id ?? ''}" routerLink="../waiter/create">
          <bi name="plus-circle" />
          {{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}
          {{ 'ADD_3' | transloco | lowercase }}</a
        >

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_WAITERS_SELECT_INFO' | transloco) : undefined">
          <button
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
            type="button"
          >
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        <div ngbDropdown container="body">
          <button
            class="btn btn-sm btn-secondary"
            id="toggleSoldOutDropdown"
            [disabled]="setSoldOutLoading() || !selection.hasValue()"
            [class.btnSpinner]="setSoldOutLoading()"
            type="button"
            ngbDropdownToggle
          >
            <bi name="power" />
            {{ 'HOME_USERS_ACTIVATED' | transloco }}
          </button>
          <div ngbDropdownMenu aria-labelledby="toggleSoldOutDropdown">
            <button (click)="toggleWaitersActivated(true)" type="button" ngbDropdownItem>
              {{ true | activated }}
              {{ 'ACTIVATE' | transloco }}
            </button>
            <button (click)="toggleWaitersActivated(false)" type="button" ngbDropdownItem>
              {{ false | activated }}
              {{ 'DEACTIVATE' | transloco }}
            </button>
          </div>
        </div>

        @if (event() ?? selectedEvent(); as event) {
          <app-waiter-create-qrcode-btn [token]="event.waiterCreateToken" />
        }

        <app-list-filter [filter]="filter" />
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                    type="checkbox"
                    name="selectAll"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    [checked]="selection.isSelected(selectable)"
                    (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                    type="checkbox"
                    name="select"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAME' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="activated">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_USERS_ACTIVATED' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.activated | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="events">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAV_EVENTS' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.events | a_mapName | s_implode: ', ' : 30 : '...' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                @let waiterAuthLink = 'ml' | shareableLink | waiterAuthLink: 'SIGN_IN' : waiter.signInToken;
                <button
                  class="btn btn-sm btn-outline-primary me-2 text-body"
                  [ngbTooltip]="'HOME_WAITERS_EDIT_QR_CODE' | transloco"
                  (mousedown)="openLoginQRCode(waiterAuthLink)"
                  stopPropagation
                  type="button"
                  placement="left"
                >
                  <bi name="qr-code" />
                </button>
                <app-action-dropdown>
                  <a
                    class="d-flex gap-2 align-items-center"
                    [queryParams]="{waiterIds: waiter.id}"
                    type="button"
                    ngbDropdownItem
                    routerLink="../../orders"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    class="d-flex gap-2 align-items-center"
                    [queryParams]="{waiterIds: waiter.id}"
                    type="button"
                    ngbDropdownItem
                    routerLink="../../bills"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="d-flex gap-2 align-items-center" (click)="toggleWaiterActivated(waiter)" type="button" ngbDropdownItem>
                    @if (!waiter.activated) {
                      {{ true | activated }}
                      {{ 'ACTIVATE' | transloco }}
                    } @else {
                      {{ false | activated }}
                      {{ 'DEACTIVATE' | transloco }}
                    }
                  </a>
                  <a class="d-flex gap-2 align-items-center" [routerLink]="'../waiter/' + waiter.id" type="button" ngbDropdownItem>
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    (mousedown)="delete.onDelete(waiter.id)"
                    type="button"
                    ngbDropdownItem
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let waiter; columns: table.columnsToDisplay()" [routerLink]="'../waiter/' + waiter.id" ngb-row></tr>
          </table>
        </div>
      }

      @if (table.isEmpty()) {
        <app-blankslate [header]="'NAV_WAITERS' | transloco" [description]="'HOME_WAITERS_EMPTY' | transloco" icon="people">
          <a class="btn btn-success" type="button" routerLink="../waiter/create">
            <bi name="plus-circle" />
            {{ 'HOME_START_SETUP_CREATE_WAITER' | transloco }}
          </a>
          <a href="https://help.kellner.team/mobile-apps.html" target="_blank">Erfahre mehr über die Apps</a>
        </app-blankslate>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'waiters-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoPipe,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    ScrollableToolbarComponent,
    BiComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
    LowerCasePipe,
    BtnWaiterCreateQrCodeComponent,
    BlankslateComponent,
    NgbDropdownModule,
    ListFilterComponent,
    ShareableLinkPipe,
    WaiterAuthLinkPipe,
  ],
})
export class WaitersPage {
  #qrCodeService = inject(QrCodeService);
  #organisationWaitersService = inject(OrganisationWaitersService);
  #waitersService = inject(WaitersService);
  #eventsService = inject(EventsService);

  setSoldOutLoading = signal(false);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  selectedEvent = inject(SelectedEventService).selected;

  event = toSignal(this.#activeId$.pipe(switchMap((id) => (id !== 'all' ? this.#eventsService.getSingle$(n_from(id)) : of(undefined)))));

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['name', 'activated', 'events', 'actions'],
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        tap(() => {
          setLoading();
          this.selection.clear();
        }),
        switchMap((activeId) => {
          if (activeId === 'all') {
            return this.#organisationWaitersService.getAll$();
          }
          return this.#waitersService.getByParent$(n_from(activeId));
        }),
      ),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#organisationWaitersService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  constructor() {
    effect(
      () => {
        if (!this.table.isLoading()) {
          this.setSoldOutLoading.set(false);
        }
      },
      {allowSignalWrites: true},
    );
  }

  openLoginQRCode(waiterAuthLink: string): void {
    this.#qrCodeService.openQRCodePage({
      data: waiterAuthLink,
      text: 'HOME_WAITERS_EDIT_QR_CODE',
      info: 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION',
    });
  }

  toggleWaiterActivated(dto: APIType['GetWaiterResponse']): void {
    this.table.isLoading.set(true);
    this.setSoldOutLoading.set(true);
    this.#waitersService.toggleActivated$(dto).subscribe();
  }

  toggleWaitersActivated(activated: boolean) {
    this.table.isLoading.set(true);
    this.setSoldOutLoading.set(true);
    forkJoin(this.selection.selection().selected.map((it) => this.#waitersService.toggleActivated$(it, activated))).subscribe();
  }
}

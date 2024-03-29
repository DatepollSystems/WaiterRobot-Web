import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {BlankslateComponent} from '@home-shared/components/blankslate.component';
import {BtnWaiterCreateQrCodeComponent} from '@home-shared/components/button/app-waiter-create-qr-code-btn.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {n_from} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe, StopPropagationDirective} from 'dfx-helper';
import {filterNil} from 'ngxtension/filter-nil';
import {injectParams} from 'ngxtension/inject-params';
import {filter, switchMap, tap} from 'rxjs';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppActivatedPipe} from '../_shared/pipes/app-activated.pipe';
import {MobileLinkService} from '../_shared/services/mobile-link.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {EventsService} from '../events/_services/events.service';
import {OrganisationWaitersService} from './_services/organisation-waiters.service';
import {WaitersService} from './_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <a routerLink="../waiter/create" class="btn btn-sm btn-success" [queryParams]="{event: activeId()}">
          <bi name="plus-circle" />
          {{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }} {{ 'ADD_3' | transloco | lowercase }}</a
        >

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_WAITERS_SELECT_INFO' | transloco) : undefined">
          <button
            type="button"
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
          >
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        @if (activeId() !== 'all' && event(); as event) {
          <app-waiter-create-qrcode-btn [token]="event.waiterCreateToken" />
        }
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (mousedown)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="selectAll"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="select"
                    [checked]="selection.isSelected(selectable)"
                    (change)="selection.toggle(selectable, $event)"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="activated">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ACTIVATED' | transloco }}</th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.activated | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="events">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_EVENTS' | transloco }}</th>
              <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.events | a_mapName | s_implode: ', ' : 30 : '...' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                <app-action-dropdown>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    (mousedown)="openLoginQRCode(waiter.signInToken)"
                  >
                    <bi name="qr-code" />
                    {{ 'HOME_WAITERS_EDIT_QR_CODE' | transloco }}
                  </button>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../orders"
                    [queryParams]="{waiterIds: waiter.id}"
                  >
                    <bi name="stack" />
                    {{ 'NAV_ORDERS' | transloco }}
                  </a>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    routerLink="../../bills"
                    [queryParams]="{waiterIds: waiter.id}"
                  >
                    <bi name="cash-coin" />
                    {{ 'NAV_BILLS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../waiter/' + waiter.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(waiter.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="selection.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let waiter; columns: selection.columnsToDisplay()" ngb-row [routerLink]="'../waiter/' + waiter.id"></tr>
          </table>
        </div>
      }

      @if (table.isEmpty()) {
        <app-blankslate icon="people" [header]="'NAV_WAITERS' | transloco" [description]="'HOME_WAITERS_EMPTY' | transloco">
          <button class="btn btn-success" type="button" routerLink="../waiter/create">
            <bi name="plus-circle" />
            {{ 'HOME_START_SETUP_CREATE_WAITER' | transloco }}
          </button>
        </app-blankslate>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-waiters',
  standalone: true,
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
    BtnWaiterSignInQrCodeComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
    LowerCasePipe,
    BtnWaiterCreateQrCodeComponent,
    BlankslateComponent,
  ],
})
export class WaitersComponent {
  #qrCodeService = inject(QrCodeService);
  #mobileLink = inject(MobileLinkService);
  #organisationWaitersService = inject(OrganisationWaitersService);
  #waitersService = inject(WaitersService);
  #eventsService = inject(EventsService);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  event = toSignal(
    this.#activeId$.pipe(
      filterNil(),
      filter((it) => it !== 'all'),
      switchMap((id) => this.#eventsService.getSingle$(n_from(id))),
    ),
  );

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

  openLoginQRCode(token: string): void {
    this.#qrCodeService.openQRCodePage({
      data: this.#mobileLink.createWaiterSignInLink(token),
      text: 'HOME_WAITERS_EDIT_QR_CODE',
      info: 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION',
    });
  }
}

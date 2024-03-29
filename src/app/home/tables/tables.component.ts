import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {NgbDropdownItem, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {n_from, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {injectParams} from 'ngxtension/inject-params';
import {switchMap} from 'rxjs';
import {TablesService} from './_services/tables.service';
import {TablesPrintQrCodesModal} from './tables-print-qr-codes.modal';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <a routerLink="../t/create" class="btn btn-sm btn-success" [queryParams]="{group: activeId()}">
          <bi name="plus-circle" />
          {{ 'HOME_TABLE' | transloco }} {{ 'ADD_3' | transloco | lowercase }}</a
        >

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="delete.onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        @if (activeId() !== 'all') {
          <a class="btn btn-sm btn-primary" [routerLink]="'../../table-groups/' + activeId()">
            <bi name="pencil-square" />
            {{ 'HOME_TABLE_GROUP' | transloco }} {{ 'EDIT' | transloco | lowercase }}</a
          >
        }

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-secondary" [class.disabled]="!selection.hasValue()" (click)="printSelectedTables()">
            <bi name="table" />
            {{ 'PRINT' | transloco }}
          </button>
        </div>
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
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      <div class="table-responsive">
        <table
          ngb-table
          ngb-sort
          ngbSortDirection="asc"
          [ngbSortActive]="activeId() === 'all' ? 'group' : 'number'"
          [hover]="true"
          [dataSource]="table.dataSource()"
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isAllSelected()"
                  (change)="selection.toggleAll()"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="selection.toggle(selectable, $event)"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="group">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | transloco }}</th>
            <td *ngbCellDef="let table" ngb-cell>
              <app-text-with-color-indicator [color]="table.group.color">
                {{ table.group.name }}
              </app-text-with-color-indicator>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="number">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NUMBER' | transloco }}</th>
            <td *ngbCellDef="let table" ngb-cell>
              <div class="d-inline-flex align-items-center gap-2">
                <span class="pt-1">{{ table.number }}</span>
                <a
                  placement="right"
                  [ngbTooltip]="'HOME_TABLES_PUBLIC_ID' | transloco"
                  [routerLink]="'/wl/t/' + table.publicId"
                  (click)="$event.stopPropagation()"
                  ><bi name="box-arrow-up-right"
                /></a>
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="status">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | transloco }}</th>
            <td *ngbCellDef="let table" ngb-cell>
              @if (table.hasActiveOrders) {
                <span class="badge text-bg-warning d-inline-flex align-items-center gap-2">
                  <bi name="exclamation-triangle-fill" />
                  {{ 'HOME_TABLE_UNPAID_PRODUCTS' | transloco }}
                </span>
              } @else {
                @if (table.missingNextTable) {
                  <div class="position-relative">
                    <div class="position-absolute" style="bottom: -25px; left: 0px">
                      <a
                        class="badge text-bg-warning d-inline-flex align-items-center gap-2"
                        [routerLink]="'../../../create'"
                        [queryParams]="{group: table.group.id, number: table.number + 1}"
                        (click)="$event.stopPropagation()"
                      >
                        <bi name="exclamation-octagon-fill" />
                        Unvollständige Reihenfolge
                      </a>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                    </div>
                  </div>
                }
              }
            </td>
          </ng-container>

          <ng-container ngbColumnDef="seats">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'SEATS' | transloco }}</th>
            <td *ngbCellDef="let table" ngb-cell>{{ table.seats }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>
              <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
            </th>
            <td *ngbCellDef="let table" ngb-cell>
              <app-action-dropdown>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../../orders"
                  [queryParams]="{tableIds: table.id}"
                >
                  <bi name="stack" />
                  {{ 'NAV_ORDERS' | transloco }}
                </a>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../../bills"
                  [queryParams]="{tableIds: table.id}"
                >
                  <bi name="cash-coin" />
                  {{ 'NAV_BILLS' | transloco }}
                </a>
                <div class="dropdown-divider"></div>
                <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../t/' + table.id">
                  <bi name="pencil-square" />
                  {{ 'EDIT' | transloco }}
                </a>
                <button
                  type="button"
                  class="d-flex gap-2 align-items-center text-danger-emphasis"
                  ngbDropdownItem
                  (click)="delete.onDelete(table.id)"
                >
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </app-action-dropdown>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="selection.columnsToDisplay()" ngb-header-row></tr>
          <tr
            *ngbRowDef="let table; columns: selection.columnsToDisplay()"
            ngb-row
            [routerLink]="'../t/' + table.id"
            [class.thick-bottom-border]="table.missingNextTable"
          ></tr>
        </table>
      </div>

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  styles: `
    .thick-bottom-border {
      border-bottom: #ffc107;
      border-bottom-style: dashed;
      border-bottom-width: 2px;
    }
  `,
  selector: 'app-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LowerCasePipe,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class TablesComponent {
  private modal = inject(NgbModal);
  #tablesService = inject(TablesService);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  columnsToDisplay = signal(['group', 'number', 'status', 'seats', 'actions']);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: this.columnsToDisplay,
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        switchMap((activeId) => {
          setLoading();
          this.selection.clear();

          if (activeId === 'all') {
            this.columnsToDisplay.update((it) => {
              const columns = it.filter((iit) => iit !== 'group');
              return ['group', ...columns];
            });
            return this.#tablesService.getAll$();
          }
          this.columnsToDisplay.update((it) => [...it.filter((iit) => iit !== 'group')]);
          return this.#tablesService.getByParent$(n_from(activeId));
        }),
      ),
    sort: this.sort,
    filterValue$: this.filter.value$,
    sortingDataAccessors: {
      group: (it) => it.group.name,
    },
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#tablesService.delete$(id),
    selection: this.selection.selection,
    nameMap: (it: GetTableWithGroupResponse): string => s_from(it.number),
  });

  printSelectedTables(): void {
    const modalRef = this.modal.open(TablesPrintQrCodesModal, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection
      .selection()
      .selected.sort((a, b) => a.group.name.localeCompare(b.group.name) || a.number - b.number);
  }
}

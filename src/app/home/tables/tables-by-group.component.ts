import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {EntitiesHeaderWithPlaceholderLayout} from '@home-shared/layouts/entities-header-with-placeholder.layout';
import {AbstractModelsListByIdComponent} from '@home-shared/list/models-list-by-id/abstract-models-list-by-id.component';
import {NgbDropdownItem, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetTableGroupResponse, GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {TableGroupsService} from './_services/table-groups.service';
import {TablesService} from './_services/tables.service';
import {TablesPrintQrCodesModal} from './tables-print-qr-codes.modal';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      @if (entity$ | async; as entity) {
        <entities-header-with-placeholder-layout [loading]="entityLoading()">
          <app-text-with-color-indicator placement="right" [color]="entity.color" [size]="30">
            <h1 class="mb-0">{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | transloco }} {{ entity.name }}</h1>
          </app-text-with-color-indicator>

          <scrollable-toolbar>
            <a routerLink="../../../create" class="btn btn-sm btn-success" [queryParams]="{group: entity.id}">
              <bi name="plus-circle" />
              {{ 'HOME_TABLE' | transloco }} {{ 'ADD_3' | transloco | lowercase }}</a
            >

            <a class="btn btn-sm btn-primary" [routerLink]="'../../' + entity.id">
              <bi name="pencil-square" />
              {{ 'HOME_TABLE_GROUP' | transloco }} {{ 'EDIT' | transloco | lowercase }}</a
            >

            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
              <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
              <button
                type="button"
                class="btn btn-sm btn-secondary"
                [class.disabled]="!selection.hasValue()"
                (click)="printSelectedTables()"
              >
                <bi name="table" />
                {{ 'PRINT' | transloco }}
              </button>
            </div>
          </scrollable-toolbar>
        </entities-header-with-placeholder-layout>
      }

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | transloco" />
          @if ((filter.value?.length ?? 0) > 0) {
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

      @if (dataSource$ | async; as dataSource) {
        <div class="table-responsive">
          <table
            ngb-table
            ngb-sort
            ngbSortActive="number"
            ngbSortDirection="asc"
            [hover]="true"
            [dataSource]="isLoading() ? [] : dataSource"
          >
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    [checked]="selection.hasValue() && isAllSelected()"
                    (change)="$event ? toggleAllRows() : null"
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
                    (change)="$event ? selection.toggle(selectable) : null"
                  />
                </div>
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
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../../../' + table.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (click)="onDelete(table.id, $event)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
            <tr
              *ngbRowDef="let table; columns: columnsToDisplay"
              ngb-row
              [routerLink]="'../../../' + table.id"
              [class.thick-bottom-border]="table.missingNextTable"
            ></tr>
          </table>
        </div>
      }
    </div>
  `,
  styles: `
    .thick-bottom-border {
      border-bottom: #ffc107;
      border-bottom-style: dashed;
      border-bottom-width: 2px;
    }
  `,
  selector: 'app-table-group-by-id-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
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
    EntitiesHeaderWithPlaceholderLayout,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class TablesByGroupComponent extends AbstractModelsListByIdComponent<GetTableWithGroupResponse, GetTableGroupResponse> {
  override nameMap = (it: GetTableWithGroupResponse): string => s_from(it.number);

  private modal = inject(NgbModal);

  constructor(tablesService: TablesService, tableGroupsService: TableGroupsService) {
    super(tablesService, tableGroupsService);

    this.columnsToDisplay = ['number', 'status', 'seats', 'actions'];
  }

  printSelectedTables(): void {
    const modalRef = this.modal.open(TablesPrintQrCodesModal, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection.selected.sort(
      (a, b) => a.group.name.localeCompare(b.group.name) || a.number - b.number,
    );
  }
}

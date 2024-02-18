import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {EntitiesHeaderWithPlaceholderLayout} from '@home-shared/layouts/entities-header-with-placeholder.layout';
import {AbstractModelsListByIdComponent} from '@home-shared/list/models-list-by-id/abstract-models-list-by-id.component';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetTableGroupResponse, GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {TableGroupsService} from './_services/table-groups.service';
import {TablesService} from './_services/tables.service';
import {TablesPrintQrCodesModal} from './tables-print-qr-codes.modal';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      @if (entity$ | async; as entity) {
        <entities-header-with-placeholder-layout [loading]="entityLoading()">
          <app-text-with-color-indicator placement="right" [color]="entity.color" [size]="30">
            <h1 class="mb-0">{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }} {{ entity.name }}</h1>
          </app-text-with-color-indicator>

          <scrollable-toolbar>
            <a routerLink="../../../create" class="btn btn-sm btn-success" [queryParams]="{group: entity.id}">
              <bi name="plus-circle" />
              {{ 'HOME_TABLE' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
            >

            <a class="btn btn-sm btn-primary" [routerLink]="'../../' + entity.id">
              <bi name="pencil-square" />
              {{ 'HOME_TABLE_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
            >

            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | tr) : undefined">
              <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>

            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | tr) : undefined">
              <button
                type="button"
                class="btn btn-sm btn-secondary"
                [class.disabled]="!selection.hasValue()"
                (click)="printSelectedTables()"
              >
                <bi name="table" />
                {{ 'PRINT' | tr }}
              </button>
            </div>
          </scrollable-toolbar>
        </entities-header-with-placeholder-layout>
      }

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | tr" />
          @if ((filter.value?.length ?? 0) > 0) {
            <button class="btn btn-outline-secondary" type="button" placement="bottom" [ngbTooltip]="'CLEAR' | tr" (click)="filter.reset()">
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
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NUMBER' | tr }}</th>
              <td *ngbCellDef="let table" ngb-cell>
                <div class="d-inline-flex align-items-center gap-2">
                  <span class="pt-1">{{ table.number }}</span>
                  <a
                    placement="right"
                    [ngbTooltip]="'HOME_TABLES_PUBLIC_ID' | tr"
                    [routerLink]="'/wl/t/' + table.publicId"
                    (click)="$event.stopPropagation()"
                    ><bi name="box-arrow-up-right"
                  /></a>
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="status">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
              <td *ngbCellDef="let table" ngb-cell>
                @if (table.hasActiveOrders) {
                  <span class="badge text-bg-warning d-inline-flex align-items-center gap-2">
                    <bi name="exclamation-triangle-fill" />
                    {{ 'HOME_TABLE_UNPAID_PRODUCTS' | tr }}</span
                  >
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="seats">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'SEATS' | tr }}</th>
              <td *ngbCellDef="let table" ngb-cell>{{ table.seats }}</td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
              <td *ngbCellDef="let table" ngb-cell>
                <a
                  class="btn btn-sm mx-1 btn-outline-success text-body-emphasis"
                  [routerLink]="'../../../' + table.id"
                  [ngbTooltip]="'EDIT' | tr"
                >
                  <bi name="pencil-square" />
                </a>
                <a
                  class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                  routerLink="../../../../orders"
                  [queryParams]="{tableIds: table.id}"
                  [ngbTooltip]="'NAV_ORDERS' | tr"
                  (click)="$event.stopPropagation()"
                >
                  <bi name="stack" />
                </a>
                <a
                  class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                  routerLink="../../../../bills"
                  [queryParams]="{tableIds: table.id}"
                  [ngbTooltip]="'NAV_BILLS' | tr"
                  (click)="$event.stopPropagation()"
                >
                  <bi name="cash-coin" />
                </a>
                <button
                  type="button"
                  class="btn btn-sm mx-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | tr"
                  (click)="onDelete(table.id, $event)"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
            <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row [routerLink]="'../../../' + table.id"></tr>
          </table>
        </div>
      }
    </div>
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
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
    EntitiesHeaderWithPlaceholderLayout,
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

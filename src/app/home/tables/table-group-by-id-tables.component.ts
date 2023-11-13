import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/color/app-text-with-color-indicator.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNumberListByIdComponent} from '../../_shared/ui/models-list-by-id/abstract-models-with-number-list-by-id.component';
import {GetTableGroupResponse, GetTableWithGroupResponse} from '../../_shared/waiterrobot-backend';
import {TableGroupsService} from './_services/table-groups.service';
import {TablesService} from './_services/tables.service';
import {PrintTableQrCodesModalComponent} from './print-table-qr-codes-modal';

@Component({
  template: `
    <ng-container *ngIf="entity$ | async as entity">
      <app-text-with-color-indicator [color]="entity.color" [size]="30" placement="right">
        <h1 class="mb-0">{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }} {{ entity?.name }}</h1>
      </app-text-with-color-indicator>

      <!-- This is necessary because other pages utilize the h1 tag, which includes a bottom margin for toolbar
      alignment. However, in this case, we employ the h1 tag with a color indicator, causing the h1 tag not to
      be centered in alignment with the color indicator. To address this, we set the h1 margin to 0,
      requiring us to manually add the margin here for proper alignment with other pages. -->
      <div class="mt-2"></div>

      <scrollable-toolbar>
        <a routerLink="../../../create" [queryParams]="{group: entity?.id}" class="btn btn-sm btn-success">
          <bi name="plus-circle" />
          {{ 'HOME_TABLE' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
        >

        <a routerLink="../../{{ entity?.id }}" class="btn btn-sm btn-primary">
          <bi name="pencil-square" />
          {{ 'HOME_TABLE_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
        >

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_TABLE_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_TABLE_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-secondary" [class.disabled]="!selection.hasValue()" (click)="printSelectedTables()">
            <bi name="table" />
            {{ 'PRINT' | tr }}
          </button>
        </div>
      </scrollable-toolbar>
    </ng-container>

    <form>
      <div class="input-group">
        <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0"
        >
          <bi name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="number" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
              />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(selectable) : null"
                [checked]="selection.isSelected(selectable)"
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="number">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NUMBER' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>{{ table.number }}</td>
        </ng-container>

        <ng-container ngbColumnDef="status">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>
            <span class="badge text-bg-warning d-inline-flex align-items-center gap-2" *ngIf="table.hasActiveOrders">
              <bi name="exclamation-triangle-fill" />
              {{ 'HOME_TABLE_UNPAID_PRODUCTS' | tr }}</span
            >
          </td>
        </ng-container>

        <ng-container ngbColumnDef="publicId">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_TABLES_PUBLIC_ID' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>
            <a (click)="$event.stopPropagation()" routerLink="/wl/t/{{ table.publicId }}" target="_blank">{{ 'OPEN' | tr }}</a>
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
              class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
              routerLink="../../../{{ table.id }}"
              ngbTooltip="{{ 'EDIT' | tr }}"
            >
              <bi name="pencil-square" />
            </a>
            <a
              class="btn btn-sm me-2 btn-outline-secondary text-body-emphasis"
              routerLink="../../../{{ table.id }}"
              [queryParams]="{tab: 'ORDERS'}"
              ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
              (click)="$event.stopPropagation()"
            >
              <bi name="stack" />
            </a>
            <button
              type="button"
              class="btn btn-sm me-2 btn-outline-danger text-body-emphasis"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(table.id, $event)"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row routerLink="../../../{{ table.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-table-group-by-id-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    RouterLink,
    LowerCasePipe,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppSpinnerRowComponent,
    AppTextWithColorIndicatorComponent,
  ],
})
export class TableGroupByIdTablesComponent extends AbstractModelsWithNumberListByIdComponent<
  GetTableWithGroupResponse,
  GetTableGroupResponse
> {
  private modal = inject(NgbModal);

  constructor(tablesService: TablesService, tableGroupsService: TableGroupsService) {
    super(tablesService, tableGroupsService);

    this.columnsToDisplay = ['number', 'status', 'publicId', 'seats', 'actions'];
  }

  printSelectedTables(): void {
    const modalRef = this.modal.open(PrintTableQrCodesModalComponent, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection.selected.sort(
      (a, b) => a.group.name.localeCompare(b.group.name) || a.number - b.number,
    );
  }
}

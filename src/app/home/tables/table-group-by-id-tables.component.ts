import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {
  AbstractModelsWithNumberListByIdComponent
} from '../../_shared/ui/models-list-by-id/abstract-models-with-number-list-by-id.component';
import {GetTableGroupResponse, GetTableResponse} from '../../_shared/waiterrobot-backend';

import {TableGroupsService} from './_services/table-groups.service';

import {TablesService} from './_services/tables.service';
import {PrintTableQrCodesModalComponent} from './print-table-qr-codes-modal';

@Component({
  template: `
    <ng-container *ngIf="entity$ | async as entity">
      <h1>"{{ entity?.name }}" {{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }}</h1>

      <btn-toolbar>
        <a routerLink="../../../create" [queryParams]="{group: entity?.id}" class="btn btn-sm btn-success">
          <i-bs name="plus-circle" />
          {{ 'HOME_TABLE' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
        >

        <a routerLink="../../{{ entity?.id }}" class="btn btn-sm btn-primary">
          <i-bs name="pencil-square" />
          {{ 'HOME_TABLE_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
        >

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_TABLE_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_TABLE_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-secondary" [class.disabled]="!selection.hasValue()" (click)="printSelectedTables()">
            <i-bs name="table" />
            {{ 'HOME_TABLE_PRINT' | tr }}
          </button>
        </div>
      </btn-toolbar>
    </ng-container>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
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

        <ng-container ngbColumnDef="publicId">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLES_PUBLIC_ID' | tr }}</th>
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
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../../../{{ table.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <a
              class="btn btn-sm m-1 btn-outline-secondary text-white"
              routerLink="../../../{{ table.id }}"
              [queryParams]="{tab: 'ORDERS'}"
              ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
              (click)="$event.stopPropagation()"
            >
              <i-bs name="stack" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(table.id, $event)"
            >
              <i-bs name="trash" />
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
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
    RouterLink,
    AppIconsModule,
    DfxTr,
    LowerCasePipe,
    NgbTooltip,
    ReactiveFormsModule,
    NgIf,
    DfxTableModule,
    DfxSortModule,
    AsyncPipe,
  ],
})
export class TableGroupByIdTablesComponent extends AbstractModelsWithNumberListByIdComponent<GetTableResponse, GetTableGroupResponse> {
  private modal = inject(NgbModal);

  constructor(tablesService: TablesService, tableGroupsService: TableGroupsService) {
    super(tablesService, tableGroupsService);

    this.columnsToDisplay = ['number', 'publicId', 'seats', 'actions'];
  }

  printSelectedTables(): void {
    const modalRef = this.modal.open(PrintTableQrCodesModalComponent, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection.selected.sort(
      (a, b) => a.groupName.localeCompare(b.groupName) || a.number - b.number,
    );
  }
}

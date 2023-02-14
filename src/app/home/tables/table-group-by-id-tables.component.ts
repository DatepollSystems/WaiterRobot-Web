import {LowerCasePipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AbstractModelsListByIdComponent} from '../../_shared/ui/abstract-models-list-by-id.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {TableGroupModel} from './_models/table-group.model';

import {TableModel} from './_models/table.model';
import {TableGroupsService} from './_services/table-groups.service';

import {TablesService} from './_services/tables.service';
import {PrintTableQrCodesModalComponent} from './print-table-qr-codes-modal';

@Component({
  template: `
    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <div [hidden]="!entitiesLoaded">
      <h1>"{{ entity?.name }}" {{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }}</h1>

      <btn-toolbar>
        <a routerLink="../../../create" [queryParams]="{group: entity?.id}" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle"></i-bs>
          {{ 'HOME_TABLE' | tr }} {{ 'ADD_3' | tr | lowercase }}</a
        >

        <a routerLink="../../{{ entity?.id }}" class="btn btn-sm btn-outline-primary">
          <i-bs name="pencil-square"></i-bs>
          {{ 'HOME_TABLE_GROUP' | tr }} {{ 'EDIT' | tr | lowercase }}</a
        >

        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection!.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash"></i-bs>
          {{ 'DELETE' | tr }}
        </button>

        <button class="btn btn-sm btn-outline-secondary" [class.disabled]="!selection!.hasValue()" (click)="printSelectedTables()">
          <i-bs name="table"></i-bs>
          {{ 'HOME_TABLE_PRINT' | tr }}
        </button>
      </btn-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="filter?.value?.length > 0">
            <i-bs name="x-circle-fill"></i-bs>
          </button>
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
          >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection!.hasValue() && isAllSelected()" />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection!.toggle(selectable) : null"
                  [checked]="selection!.isSelected(selectable)" />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let table" ngb-cell>{{ table.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="seats">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'SEATS' | tr }}</th>
            <td *ngbCellDef="let table" ngb-cell>{{ table.seats }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let table" ngb-cell>
              <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../../../{{ table.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
                <i-bs name="pencil-square"></i-bs>
              </a>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-white"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(table.id, $event)">
                <i-bs name="trash"></i-bs>
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row routerLink="../../../{{ table.id }}"></tr>
        </table>
      </div>
    </div>
  `,
  selector: 'app-table-group-by-id-tables',
  standalone: true,
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
  ],
})
export class TableGroupByIdTablesComponent extends AbstractModelsListByIdComponent<TableModel, TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];
  override getAllParam = 'groupId';

  constructor(tablesService: TablesService, tableGroupsService: TableGroupsService) {
    super(tablesService, tableGroupsService);

    this.setSelectable();
  }

  printSelectedTables(): void {
    const modalRef = this.modal.open(PrintTableQrCodesModalComponent, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection?.selected.sort(function (a, b) {
      return a.groupName.localeCompare(b.groupName) || a.tableNumber - b.tableNumber;
    });
  }
}
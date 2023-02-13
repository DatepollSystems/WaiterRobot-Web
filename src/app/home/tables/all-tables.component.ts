import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {EventModel} from '../events/_models/event.model';

import {TableModel} from './_models/table.model';

import {TablesService} from './_services/tables.service';
import {PrintTableQrCodesModalComponent} from './print-table-qr-codes-modal';

@Component({
  template: `
    <h1>{{ 'HOME_TABLES' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>

      <div>
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection!.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash"></i-bs>
          {{ 'DELETE' | tr }}
        </button>
      </div>

      <div>
        <button class="btn btn-sm btn-outline-secondary" [class.disabled]="!selection!.hasValue()" (click)="printSelectedTables()">
          <i-bs name="table"></i-bs>
          {{ 'HOME_TABLE_PRINT' | tr }}
        </button>
      </div>
    </btn-toolbar>

    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <form [hidden]="!entitiesLoaded">
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

    <div class="table-responsive" [hidden]="!entitiesLoaded">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="groupName" ngbSortDirection="asc">
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

        <ng-container ngbColumnDef="groupName">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>{{ table.groupName }}</td>
        </ng-container>

        <ng-container ngbColumnDef="number">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NUMBER' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>{{ table.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="seats">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'SEATS' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>{{ table.seats }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ table.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
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
        <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row routerLink="../{{ table.id }}"></tr>
      </table>
    </div>
  `,
  selector: 'app-all-tables',
  standalone: true,
  imports: [
    AppBtnToolbarComponent,
    RouterLink,
    AppIconsModule,
    DfxTr,
    AppSpinnerRowComponent,
    NgbTooltip,
    NgIf,
    DfxTableModule,
    DfxSortModule,
    ReactiveFormsModule,
  ],
})
export class AllTablesComponent extends AbstractModelsListComponent<TableModel> {
  override columnsToDisplay = ['groupName', 'number', 'seats', 'actions'];

  selectedEvent: EventModel | undefined;

  constructor(protected entitiesService: TablesService) {
    super(entitiesService);

    this.setSelectable();

    this.entitiesService.setSelectedEventGetAllUrl();
  }

  protected override initializeEntities(): void {
    this.entitiesService.setSelectedEventGetAllUrl();
    super.initializeEntities();
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

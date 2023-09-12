import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/app-text-with-color-indicator.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNumberListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-number-list-with-delete.component';
import {GetTableResponse} from '../../_shared/waiterrobot-backend';
import {TablesService} from './_services/tables.service';
import {PrintTableQrCodesModalComponent} from './print-table-qr-codes-modal';

@Component({
  template: `
    <h1>{{ 'HOME_TABLES' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <i-bs name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>

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

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="group" ngbSortDirection="asc">
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

        <ng-container ngbColumnDef="group">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_TABLE_GROUP_TABLES_VIEW' | tr }}</th>
          <td *ngbCellDef="let table" ngb-cell>
            <app-text-with-color-indicator [color]="table.group.color">
              {{ table.group.name }}
            </app-text-with-color-indicator>
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
              <i-bs name="exclamation-triangle-fill" />
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
            <a class="btn btn-sm me-2 btn-outline-success text-white" routerLink="../{{ table.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <a
              class="btn btn-sm me-2 btn-outline-secondary text-white"
              routerLink="../{{ table.id }}"
              [queryParams]="{tab: 'ORDERS'}"
              ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
              (click)="$event.stopPropagation()"
            >
              <i-bs name="stack" />
            </a>
            <button
              type="button"
              class="btn btn-sm me-2 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(table.id, $event)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row routerLink="../{{ table.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-all-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    DfxTr,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
    AppTextWithColorIndicatorComponent,
  ],
})
export class AllTablesComponent extends AbstractModelsWithNumberListWithDeleteComponent<GetTableResponse> {
  private modal = inject(NgbModal);

  constructor(protected entitiesService: TablesService) {
    super(entitiesService);

    this.columnsToDisplay = ['group', 'number', 'status', 'publicId', 'seats', 'actions'];

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('group', (it) => it.group.name);
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

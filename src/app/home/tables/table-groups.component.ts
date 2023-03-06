import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetTableGroupResponse} from '../../_shared/waiterrobot-backend';

import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <h1>{{ 'HOME_TABLE_GROUPS' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash" />
          {{ 'DELETE' | tr }}
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
          *ngIf="(filter?.value?.length ?? 0) > 0">
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()" />
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
                [checked]="selection.isSelected(selectable)" />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let tableGroup" ngb-cell>{{ tableGroup.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let tableGroup" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ tableGroup.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(tableGroup.id, $event)">
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let tableGroup; columns: columnsToDisplay" ngb-row routerLink="../{{ tableGroup.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-table-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    RouterLink,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
    AppIconsModule,
  ],
})
export class TableGroupsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetTableGroupResponse> {
  constructor(tableGroupsService: TableGroupsService) {
    super(tableGroupsService);

    this.columnsToDisplay = ['name', 'actions'];
  }
}

import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/color/app-text-with-color-indicator.component';
import {AppOrderModeSwitchComponent} from '../../_shared/ui/form/app-order-mode-switch.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {
  AbstractModelsWithNameListWithDeleteAndOrderComponent,
  AbstractModelsWithNameListWithDeleteAndOrderStyle,
} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete-and-order.component';
import {GetTableGroupResponse} from '../../_shared/waiterrobot-backend';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <h1>{{ 'HOME_TABLE_GROUPS' | tr }}</h1>

    <scrollable-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <bi name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>
      <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_TABLE_GROUP_SELECT' | tr) : undefined }}">
        <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <bi name="trash" />
          {{ 'DELETE' | tr }}
        </button>
      </div>
      <div class="d-flex align-items-center">
        <app-order-mode-switch [orderMode]="orderMode()" (orderModeChange)="setOrderMode($event)" />
      </div>
    </scrollable-toolbar>

    <form>
      <div class="input-group">
        <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        @if ((filter?.value?.length ?? 0) > 0) {
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
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
        [hover]="true"
        *ngSub="dataSource$; let dataSource"
        [dataSource]="dataSource ?? []"
        ngb-sort
        ngbSortActive="name"
        ngbSortDirection="asc"
        [ngbSortDisabled]="orderMode()"
        cdkDropList
        cdkDropListLockAxis="y"
        (cdkDropListDropped)="drop($event)"
        [cdkDropListData]="dataSource"
        [cdkDropListDisabled]="!orderMode()"
      >
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            @if (!orderMode()) {
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                />
              </div>
            }
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            @if (orderMode()) {
              <button class="btn btn-sm btn-outline-primary text-body-emphasis" cdkDragHandle>
                <bi name="grip-vertical" />
              </button>
            }
            @if (!orderMode()) {
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
            }
          </td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let tableGroup" ngb-cell>
            <app-text-with-color-indicator [color]="tableGroup.color">
              {{ tableGroup.name }}
            </app-text-with-color-indicator>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let tableGroup" ngb-cell>
            <a
              class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
              routerLink="../{{ tableGroup.id }}"
              ngbTooltip="{{ 'EDIT' | tr }}"
            >
              <bi name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm me-2 btn-outline-danger text-body-emphasis"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(tableGroup.id, $event)"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr
          *ngbRowDef="let tableGroup; columns: columnsToDisplay"
          ngb-row
          cdkDrag
          [cdkDragData]="tableGroup"
          routerLink="../{{ tableGroup.id }}"
        ></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  styles: [AbstractModelsWithNameListWithDeleteAndOrderStyle],
  selector: 'app-table-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgbTooltip,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    NgSub,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    AppSpinnerRowComponent,
    ScrollableToolbarComponent,
    BiComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
  ],
})
export class TableGroupsComponent extends AbstractModelsWithNameListWithDeleteAndOrderComponent<GetTableGroupResponse> {
  constructor(private tableGroupsService: TableGroupsService) {
    super(tableGroupsService);

    this.columnsToDisplay = ['name', 'actions'];
  }
}

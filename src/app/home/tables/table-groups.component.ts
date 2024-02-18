import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '@home-shared/form/app-order-mode-switch.component';
import {
  AbstractModelsWithNameListWithDeleteAndOrderComponent,
  AbstractModelsWithNameListWithDeleteAndOrderStyle,
} from '@home-shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete-and-order.component';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetTableGroupResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_TABLE_GROUPS' | tr }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_GROUP_SELECT_INFO' | tr) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
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
            ngbSortActive="name"
            ngbSortDirection="asc"
            cdkDropList
            cdkDropListLockAxis="y"
            [hover]="true"
            [dataSource]="dataSource"
            [ngbSortDisabled]="orderMode()"
            [cdkDropListData]="dataSource.data"
            [cdkDropListDisabled]="!orderMode()"
            (cdkDropListDropped)="drop($event)"
          >
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                @if (!orderMode()) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.hasValue() && isAllSelected()"
                      (change)="$event ? toggleAllRows() : null"
                    />
                  </div>
                }
              </th>
              <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
                @if (orderMode()) {
                  <button type="button" class="btn btn-sm btn-outline-primary text-body-emphasis" cdkDragHandle>
                    <bi name="grip-vertical" />
                  </button>
                }
                @if (!orderMode()) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.isSelected(selectable)"
                      (change)="$event ? selection.toggle(selectable) : null"
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
                  class="btn btn-sm mx-1 btn-outline-success text-body-emphasis"
                  [routerLink]="'../' + tableGroup.id"
                  [ngbTooltip]="'EDIT' | tr"
                >
                  <bi name="pencil-square" />
                </a>
                <a
                  class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                  routerLink="../../../orders"
                  [queryParams]="{tableGroupIds: tableGroup.id}"
                  [ngbTooltip]="'NAV_ORDERS' | tr"
                  (click)="$event.stopPropagation()"
                >
                  <bi name="stack" />
                </a>
                <a
                  class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                  routerLink="../../../bills"
                  [queryParams]="{tableGroupIds: tableGroup.id}"
                  [ngbTooltip]="'NAV_BILLS' | tr"
                  (click)="$event.stopPropagation()"
                >
                  <bi name="cash-coin" />
                </a>
                <button
                  type="button"
                  class="btn btn-sm mx-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | tr"
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
              [routerLink]="'../' + tableGroup.id"
            ></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="isLoading()" />
    </div>
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
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    ScrollableToolbarComponent,
    BiComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
    AppProgressBarComponent,
  ],
})
export class TableGroupsComponent extends AbstractModelsWithNameListWithDeleteAndOrderComponent<GetTableGroupResponse> {
  constructor(private tableGroupsService: TableGroupsService) {
    super(tableGroupsService);

    this.columnsToDisplay = ['name', 'actions'];
  }
}

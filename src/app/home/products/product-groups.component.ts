import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetProductGroupResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppOrderModeSwitchComponent} from '../_shared/form/app-order-mode-switch.component';
import {
  AbstractModelsWithNameListWithDeleteAndOrderComponent,
  AbstractModelsWithNameListWithDeleteAndOrderStyle,
} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete-and-order.component';
import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PROD_GROUPS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>
        <div class="d-flex align-items-center">
          <app-order-mode-switch [orderMode]="orderMode()" (orderModeChange)="setOrderMode($event)" />
        </div>
      </scrollable-toolbar>

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

      <div class="table-responsive">
        <table
          *ngSub="dataSource$; let dataSource"
          ngb-table
          ngb-sort
          ngbSortActive="name"
          ngbSortDirection="asc"
          cdkDropList
          cdkDropListLockAxis="y"
          [hover]="true"
          [dataSource]="dataSource ?? []"
          [ngbSortDisabled]="orderMode()"
          [cdkDropListData]="dataSource"
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
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
            <td *ngbCellDef="let productGroup" ngb-cell>
              <app-text-with-color-indicator [color]="productGroup.color">
                {{ productGroup.name }}
              </app-text-with-color-indicator>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>
              <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
            </th>
            <td *ngbCellDef="let productGroup" ngb-cell>
              <app-action-dropdown>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../orders"
                  [queryParams]="{productGroupIds: productGroup.id}"
                >
                  <bi name="stack" />
                  {{ 'NAV_ORDERS' | transloco }}
                </a>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../bills"
                  [queryParams]="{productGroupIds: productGroup.id}"
                >
                  <bi name="cash-coin" />
                  {{ 'NAV_BILLS' | transloco }}
                </a>
                <div class="dropdown-divider"></div>
                <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + productGroup.id">
                  <bi name="pencil-square" />
                  {{ 'EDIT' | transloco }}
                </a>
                <button
                  type="button"
                  class="d-flex gap-2 align-items-center text-danger-emphasis"
                  ngbDropdownItem
                  (click)="onDelete(productGroup.id, $event)"
                >
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </app-action-dropdown>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr
            *ngbRowDef="let productGroup; columns: columnsToDisplay"
            ngb-row
            cdkDrag
            [cdkDragData]="productGroup"
            [routerLink]="'../' + productGroup.id"
          ></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  styles: [AbstractModelsWithNameListWithDeleteAndOrderStyle],
  selector: 'app-product-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NgSub,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    ScrollableToolbarComponent,
    BiComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class ProductGroupsComponent extends AbstractModelsWithNameListWithDeleteAndOrderComponent<GetProductGroupResponse> {
  constructor(entitiesService: ProductGroupsService) {
    super(entitiesService);

    this.columnsToDisplay = ['name', 'actions'];
  }
}

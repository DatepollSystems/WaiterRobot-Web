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

import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {GetProductGroupResponse} from '../../_shared/waiterrobot-backend';
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
      <h1 class="my-0">{{ 'HOME_PROD_GROUPS' | tr }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>
        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | tr) : undefined }}">
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
          @if ((filter.value?.length ?? 0) > 0) {
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
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
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
                    (change)="$event ? selection.toggle(selectable) : null"
                    [checked]="selection.isSelected(selectable)"
                  />
                </div>
              }
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let productGroup" ngb-cell>
              <app-text-with-color-indicator [color]="productGroup.color">
                {{ productGroup.name }}
              </app-text-with-color-indicator>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let productGroup" ngb-cell>
              <a
                class="btn btn-sm mx-1 btn-outline-success text-body-emphasis"
                routerLink="../{{ productGroup.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}"
              >
                <bi name="pencil-square" />
              </a>
              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../../orders"
                [queryParams]="{productGroupIds: productGroup.id}"
                ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
                (click)="$event.stopPropagation()"
              >
                <bi name="stack" />
              </a>
              <a
                class="btn btn-sm mx-1 btn-outline-secondary text-body-emphasis"
                routerLink="../../../bills"
                [queryParams]="{productGroupIds: productGroup.id}"
                ngbTooltip="{{ 'NAV_BILLS' | tr }}"
                (click)="$event.stopPropagation()"
              >
                <bi name="cash-coin" />
              </a>
              <button
                type="button"
                class="btn btn-sm mx-1 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(productGroup.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr
            *ngbRowDef="let productGroup; columns: columnsToDisplay"
            ngb-row
            cdkDrag
            [cdkDragData]="productGroup"
            routerLink="../{{ productGroup.id }}"
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
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    ScrollableToolbarComponent,
    BiComponent,
    AppTextWithColorIndicatorComponent,
    AppOrderModeSwitchComponent,
    AppProgressBarComponent,
  ],
})
export class ProductGroupsComponent extends AbstractModelsWithNameListWithDeleteAndOrderComponent<GetProductGroupResponse> {
  constructor(entitiesService: ProductGroupsService) {
    super(entitiesService);

    this.columnsToDisplay = ['name', 'actions'];
  }
}

import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetBillUnpaidReasonResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-list-with-delete.component';
import {UnpaidReasonsService} from './_services/unpaid-reasons.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_BILL_UNPAID_REASON' | tr }}</h1>
      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | tr) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
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

      <div class="table-responsive">
        <table ngb-table ngb-sort ngbSortActive="reason" ngbSortDirection="asc" [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.hasValue() && isAllSelected()"
                  (change)="$event ? toggleAllRows() : null"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="reason">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Reason' | tr }}</th>
            <td *ngbCellDef="let reason" ngb-cell>{{ reason.reason }}</td>
          </ng-container>

          <ng-container ngbColumnDef="description">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Description' | tr }}</th>
            <td *ngbCellDef="let reason" ngb-cell>{{ reason.description }}</td>
          </ng-container>

          <ng-container ngbColumnDef="isGlobal">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'is Global' | tr }}</th>
            <td *ngbCellDef="let reason" ngb-cell>
              {{ reason.isGlobal }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let reason" ngb-cell>
              @if (!reason.isGlobal) {
                <a
                  class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
                  [routerLink]="'../' + reason.id"
                  [ngbTooltip]="'EDIT' | tr"
                >
                  <bi name="pencil-square" />
                </a>
                <button
                  type="button"
                  class="btn btn-sm me-2 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | tr"
                  (click)="onDelete(reason.id, $event)"
                >
                  <bi name="trash" />
                </button>
              }
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let reason; columns: columnsToDisplay" ngb-row [routerLink]="'../' + reason.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  selector: 'app-all-unpaid-reasons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
  ],
})
export class AllUnpaidReasonsComponent extends AbstractModelsListWithDeleteComponent<GetBillUnpaidReasonResponse> {
  override nameMap = (it: GetBillUnpaidReasonResponse): string => it.reason;

  constructor(protected entitiesService: UnpaidReasonsService) {
    super(entitiesService);

    this.columnsToDisplay = ['reason', 'description', 'isGlobal', 'actions'];
  }
}

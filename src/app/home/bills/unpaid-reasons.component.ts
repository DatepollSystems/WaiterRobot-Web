import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {AppSoldOutPipe} from '@home-shared/pipes/app-sold-out.pipe';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetBillUnpaidReasonResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {UnpaidReasonsService} from './_services/unpaid-reasons.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_BILL_UNPAID_REASON' | transloco }}</h1>
      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
          <button
            type="button"
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
          >
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (mousedown)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="reason" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                @if (!selectable.isGlobal) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.isSelected(selectable)"
                      (change)="selection.toggle(selectable, $event)"
                    />
                  </div>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="reason">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_BILL_UNPAID_REASON_REASON' | transloco }}</th>
              <td *ngbCellDef="let reason" ngb-cell>{{ reason.reason }}</td>
            </ng-container>

            <ng-container ngbColumnDef="description">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco }}</th>
              <td *ngbCellDef="let reason" ngb-cell>{{ reason.description }}</td>
            </ng-container>

            <ng-container ngbColumnDef="isGlobal">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'Editierbar' | transloco }}</th>
              <td *ngbCellDef="let reason" ngb-cell>
                {{ reason.isGlobal | soldOut }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
              <td *ngbCellDef="let reason" ngb-cell>
                @if (!reason.isGlobal) {
                  <app-action-dropdown>
                    <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + reason.id">
                      <bi name="pencil-square" />
                      {{ 'EDIT' | transloco }}
                    </a>
                    <button
                      type="button"
                      class="d-flex gap-2 align-items-center text-danger-emphasis"
                      ngbDropdownItem
                      (mousedown)="delete.onDelete(reason.id)"
                    >
                      <bi name="trash" />
                      {{ 'DELETE' | transloco }}
                    </button>
                  </app-action-dropdown>
                }
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="selection.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let reason; columns: selection.columnsToDisplay()" ngb-row [routerLink]="'../' + reason.id"></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-unpaid-reasons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    AppSoldOutPipe,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
  ],
})
export class UnpaidReasonsComponent {
  #unpaidReasonsService = inject(UnpaidReasonsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['reason', 'description', 'isGlobal', 'actions'],
    fetchData: () => this.#unpaidReasonsService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
    selectableFilter: (it) => !it.isGlobal,
  });

  delete = injectTableDelete({
    selection: this.selection.selection,
    delete$: (id) => this.#unpaidReasonsService.delete$(id),
    nameMap: (it: GetBillUnpaidReasonResponse): string => it.reason,
  });
}

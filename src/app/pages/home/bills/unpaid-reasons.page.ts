import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {ActionDropdownComponent} from '../../../components/action-dropdown.component';
import {AppProgressBarComponent} from '../../../components/loading/app-progress-bar.component';
import {ScrollableToolbarComponent} from '../../../components/scrollable-toolbar.component';
import {AppSoldOutPipe} from '../../../pipes/app-sold-out.pipe';
import {UnpaidReasonsService} from '../../../services/unpaid-reasons.service';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '../../../util/list';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_BILL_UNPAID_REASON' | transloco }}</h1>
      <scrollable-toolbar>
        <div>
          <a class="btn btn-sm btn-success" routerLink="../create">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
          <button
            class="btn btn-sm btn-danger"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="delete.onDeleteSelected()"
            type="button"
          >
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" type="text" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              [ngbTooltip]="'CLEAR' | transloco"
              (mousedown)="filter.reset()"
              type="button"
              placement="bottom"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort ngbSortActive="reason" ngbSortDirection="asc">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                    type="checkbox"
                    name="checked"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                @if (!selectable.isGlobal) {
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      [checked]="selection.isSelected(selectable)"
                      (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                      type="checkbox"
                      name="checked"
                    />
                  </div>
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="reason">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_BILL_UNPAID_REASON_REASON' | transloco }}
              </th>
              <td *ngbCellDef="let reason" ngb-cell>{{ reason.reason }}</td>
            </ng-container>

            <ng-container ngbColumnDef="description">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_BILL_UNPAID_REASON_DESCRIPTION' | transloco }}
              </th>
              <td *ngbCellDef="let reason" ngb-cell>
                {{ reason.description }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="isGlobal">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'Editierbar' | transloco }}
              </th>
              <td *ngbCellDef="let reason" ngb-cell>
                {{ reason.isGlobal | soldOut }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'ACTIONS' | transloco }}
              </th>
              <td *ngbCellDef="let reason" ngb-cell>
                @if (!reason.isGlobal) {
                  <app-action-dropdown>
                    <a class="d-flex gap-2 align-items-center" [routerLink]="'../' + reason.id" type="button" ngbDropdownItem>
                      <bi name="pencil-square" />
                      {{ 'EDIT' | transloco }}
                    </a>
                    <button
                      class="d-flex gap-2 align-items-center text-danger-emphasis"
                      (mousedown)="delete.onDelete(reason.id)"
                      type="button"
                      ngbDropdownItem
                    >
                      <bi name="trash" />
                      {{ 'DELETE' | transloco }}
                    </button>
                  </app-action-dropdown>
                }
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let reason; columns: table.columnsToDisplay()" [routerLink]="'../' + reason.id" ngb-row></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'unpaid-reasons-page',
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
export class UnpaidReasonsPage {
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
    nameMap: (it): string => it.reason,
  });
}

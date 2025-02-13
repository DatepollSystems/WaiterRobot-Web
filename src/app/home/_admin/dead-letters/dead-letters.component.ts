import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxCutPipe, StopPropagationDirective} from 'dfx-helper';

import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {ListFilterComponent, injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {DeadLettersService} from './dead-letters.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'Dead Letters' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
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

        <app-list-filter [filter]="filter" />
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort ngbSortActive="id" ngbSortDirection="desc">
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
                <div class="form-check">
                  <input
                    class="form-check-input"
                    [checked]="selection.isSelected(selectable)"
                    (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                    type="checkbox"
                    name="checked"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="queue">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'Queue' | transloco }}
              </th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.queue }}</td>
            </ng-container>

            <ng-container ngbColumnDef="exchange">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'Exchange' | transloco }}
              </th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.exchange }}</td>
            </ng-container>

            <ng-container ngbColumnDef="body">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'Body' | transloco }}
              </th>
              <td *ngbCellDef="let it" ngb-cell>
                {{ it.body | s_cut: 60 : '...' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="createdAt">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_ORDER_CREATED_AT' | transloco }}
              </th>
              <td *ngbCellDef="let it" ngb-cell>
                {{ it.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'ACTIONS' | transloco }}
              </th>
              <td *ngbCellDef="let it" ngb-cell>
                <a
                  class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                  [routerLink]="'../' + it.id"
                  [ngbTooltip]="'EDIT' | transloco"
                >
                  <bi name="pencil-square" />
                </a>
                <button
                  class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | transloco"
                  (mousedown)="delete.onDelete(it.id)"
                  type="button"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let it; columns: table.columnsToDisplay()" [routerLink]="'../' + it.id" ngb-row></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-dead-letters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    DfxCutPipe,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    StopPropagationDirective,
    ListFilterComponent,
  ],
})
export class DeadLettersComponent {
  #deadLettersService = inject(DeadLettersService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['id', 'queue', 'exchange', 'body', 'createdAt'],
    fetchData: () => this.#deadLettersService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#deadLettersService.delete$(id),
    selection: this.selection.selection,
    nameMap: (it): string => s_from(it.id),
  });
}

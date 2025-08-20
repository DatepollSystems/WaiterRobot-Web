import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {AppSpinnerRowComponent} from '../../components/loading/app-spinner-row.component';
import {ScrollableToolbarComponent} from '../../components/scrollable-toolbar.component';
import {ListFilterComponent, injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '../../util/list';
import {UserSessionsService} from './_services/user-sessions.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-2">
      <h1 class="my-0">{{ 'NAV_USER_SESSIONS' | transloco }}</h1>

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
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort ngbSortActive="updatedAt" ngbSortDirection="desc">
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

            <ng-container ngbColumnDef="description">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAME' | transloco }}
              </th>
              <td *ngbCellDef="let session" ngb-cell>{{ session.description }}</td>
            </ng-container>

            <ng-container ngbColumnDef="createdAt">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_USERSETTINGS_SESSIONS_REGISTERED_AT' | transloco }}
              </th>
              <td *ngbCellDef="let session" ngb-cell>
                {{ session.createdAt | date: 'yyyy.MM.dd - HH:mm:ss' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="updatedAt">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | transloco }}
              </th>
              <td *ngbCellDef="let session" ngb-cell>
                {{ session.updatedAt | date: 'yyyy.MM.dd - HH:mm:ss' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'ACTIONS' | transloco }}
              </th>
              <td *ngbCellDef="let session" ngb-cell>
                <button
                  class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | transloco"
                  (click)="delete.onDelete(session.id)"
                  type="button"
                  placement="left"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let session; columns: table.columnsToDisplay()" ngb-row></tr>
          </table>
        </div>
      }

      <app-spinner-row [show]="table.isLoading()" />
    </div>
  `,
  selector: 'sessions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    AppSpinnerRowComponent,
    ScrollableToolbarComponent,
    StopPropagationDirective,
    ListFilterComponent,
  ],
})
export class SessionsPage {
  #sessionsService = inject(UserSessionsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['description', 'createdAt', 'updatedAt', 'actions'],
    fetchData: () => this.#sessionsService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#sessionsService.delete$(id),
    selection: this.selection.selection,
    nameMap: (it) => it.description,
  });
}

import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {n_from} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {injectParams} from 'ngxtension/inject-params';
import {switchMap, tap} from 'rxjs';
import {WaiterSessionsService} from '../_services/waiter-sessions.service';

@Component({
  template: `
    <form class="d-flex flex-column flex-sm-row gap-2">
      <div class="flex-grow-1">
        <div class="input-group">
          <input class="form-control" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
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
      </div>

      <button
        class="btn btn-sm btn-outline-danger"
        type="button"
        [class.disabled]="!selection.hasValue()"
        (mousedown)="delete.onDeleteSelected()"
      >
        <bi name="trash" />
        {{ 'DELETE' | transloco }}
      </button>
    </form>

    <div class="table-responsive">
      <table ngb-table ngb-sort ngbSortActive="updatedAt" ngbSortDirection="desc" [hover]="true" [dataSource]="table.dataSource()">
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
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                [checked]="selection.isSelected(selectable)"
                (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="registeredAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_REGISTERED_AT' | transloco }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.registeredAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="updatedAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | transloco }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.updatedAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
          <td *ngbCellDef="let session" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
              placement="left"
              [ngbTooltip]="'DELETE' | transloco"
              (mousedown)="delete.onDelete(session.id)"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
        <tr *ngbRowDef="let session; columns: table.columnsToDisplay()" ngb-row></tr>
      </table>
    </div>

    <app-progress-bar [show]="table.isLoading()" />
  `,
  selector: 'app-waiter-sessions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    StopPropagationDirective,
    AppProgressBarComponent,
  ],
})
export class WaiterSessionsComponent {
  #waiterSessionsService = inject(WaiterSessionsService);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['name', 'registeredAt', 'updatedAt', 'actions'],
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        tap(() => {
          setLoading();
          this.selection.clear();
        }),
        switchMap((activeId) => {
          if (activeId === 'all') {
            return this.#waiterSessionsService.getAll$();
          }
          return this.#waiterSessionsService.getByParent$(n_from(activeId));
        }),
      ),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#waiterSessionsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });
}

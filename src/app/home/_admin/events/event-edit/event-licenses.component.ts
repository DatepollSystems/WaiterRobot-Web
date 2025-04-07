import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';

import {switchMap, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {n_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {injectParams} from 'ngxtension/inject-params';

import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

@Component({
  template: `
    <div class="d-flex flex-column flex-sm-row gap-2">
      <button
        class="btn btn-sm btn-outline-danger"
        [class.disabled]="!selection.hasValue()"
        (mousedown)="delete.onDeleteSelected()"
        type="button"
      >
        <bi name="trash" />
        {{ 'DELETE' | transloco }}
      </button>
    </div>

    <div class="table-responsive">
      <table [hover]="true" [dataSource]="table.dataSource()" ngb-table ngb-sort ngbSortActive="updatedAt" ngbSortDirection="desc">
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
            {{ session.createdAt | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="updatedAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | transloco }}
          </th>
          <td *ngbCellDef="let session" ngb-cell>
            {{ session.updatedAt | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
          <td *ngbCellDef="let session" ngb-cell>
            <button
              class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
              [ngbTooltip]="'DELETE' | transloco"
              (mousedown)="delete.onDelete(session.id)"
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

    <app-progress-bar [show]="table.isLoading()" />
  `,
  selector: 'app-event-license',
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

  #activeId = injectParams('id');
  #activeId$ = toObservable(this.#activeId);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['description', 'createdAt', 'updatedAt', 'actions'],
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        tap(() => {
          setLoading();
          this.selection.clear();
        }),
        switchMap((activeId) => this.#waiterSessionsService.getByParent$(n_from(activeId))),
      ),
    sort: this.sort,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#waiterSessionsService.delete$(id),
    selection: this.selection.selection,
    nameMap: (it) => it.description,
  });
}

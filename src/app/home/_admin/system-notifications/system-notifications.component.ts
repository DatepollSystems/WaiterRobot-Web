import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect, ListFilterComponent} from '@home-shared/list';
import {AppActivatedPipe} from '@home-shared/pipes/app-activated.pipe';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {AppSystemNotificationTypeBadgeComponent} from './_components/system-notification-type-badge.component';
import {SystemNotificationsService} from './_services/system-notifications.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_SYSTEM_NOTIFICATIONS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>
        <div>
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

        <app-list-filter [filter]="filter" />
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="id" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
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

            <ng-container ngbColumnDef="title">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TITLE' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.title }}</td>
            </ng-container>

            <ng-container ngbColumnDef="type">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TYPE' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>
                <app-system-notification-type-badge [type]="it.type" />
              </td>
            </ng-container>

            <ng-container ngbColumnDef="starts">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STARTS' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.starts | date: 'dd.MM.YYYY HH:mm' : 'UTC' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="ends">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ENDS' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>{{ it.ends | date: 'dd.MM.YYYY HH:mm' : 'UTC' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="active">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIVE' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>
                {{ it.active | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
              <td *ngbCellDef="let it" ngb-cell>
                <a
                  class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                  [routerLink]="'../' + it.id"
                  [ngbTooltip]="'EDIT' | transloco"
                >
                  <bi name="pencil-square" />
                </a>
                <button
                  type="button"
                  class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | transloco"
                  (mousedown)="delete.onDelete(it.id)"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let it; columns: table.columnsToDisplay()" ngb-row [routerLink]="'../' + it.id"></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-system-notifications',
  standalone: true,
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
    ScrollableToolbarComponent,
    AppSystemNotificationTypeBadgeComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
    StopPropagationDirective,
    ListFilterComponent,
  ],
})
export class SystemNotificationsComponent {
  #systemNotificationService = inject(SystemNotificationsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['title', 'type', 'starts', 'ends', 'active', 'actions'],
    fetchData: () => this.#systemNotificationService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    selection: this.selection.selection,
    delete$: (id) => this.#systemNotificationService.delete$(id),
    nameMap: (it): string => it.title ?? it.type,
  });
}

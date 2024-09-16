import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect, ListFilterComponent} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {n_from} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {injectParams} from 'ngxtension/inject-params';
import {filter, map, switchMap, tap} from 'rxjs';
import {EventsService} from './_services/events.service';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div>
          <a routerLink="../e/create" class="btn btn-sm btn-success" [queryParams]="{orgId: activeId()}">
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
          <table ngb-table ngb-sort ngbSortActive="date" ngbSortDirection="desc" [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="selectAll"
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
                    name="select"
                    [checked]="selection.isSelected(selectable)"
                    (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let event" ngb-cell>{{ event.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="startDate">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_EVENTS_START_DATE' | transloco }}</th>
              <td *ngbCellDef="let event" ngb-cell>{{ event.startDate | date: 'dd.MM.yyyy HH:mm' : 'UTC' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="endDate">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_EVENTS_END_DATE' | transloco }}</th>
              <td *ngbCellDef="let event" ngb-cell>{{ event.endDate | date: 'dd.MM.yyyy HH:mm' : 'UTC' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="street">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_ORGS_STREET' | transloco }} {{ 'HOME_ORGS_STREETNUMBER' | transloco }}
              </th>
              <td *ngbCellDef="let event" ngb-cell>{{ event.street }}, {{ event.streetNumber }}</td>
            </ng-container>

            <ng-container ngbColumnDef="city">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_CITY' | transloco }}</th>
              <td *ngbCellDef="let event" ngb-cell>{{ event.postalCode }}, {{ event.city }}</td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let event" ngb-cell>
                <app-action-dropdown>
                  <button type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem (click)="clone(event.id)">
                    <bi name="clipboard" />
                    {{ 'COPY' | transloco }}
                  </button>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../e/' + event.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(event.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let event; columns: table.columnsToDisplay()" ngb-row [routerLink]="'../e/' + event.id"></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
    ListFilterComponent,
    ScrollableToolbarComponent,
  ],
  standalone: true,
})
export class EventsComponent {
  #eventsService = inject(EventsService);

  activeId = injectParams('id');
  #activeId$ = toObservable(this.activeId);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['name', 'startDate', 'endDate', 'street', 'city', 'actions'],
    fetchData: (setLoading) =>
      this.#activeId$.pipe(
        tap(() => {
          setLoading();
          this.selection.clear();
        }),
        map((it) => n_from(it)),
        filter((it) => !Number.isNaN(it)),
        switchMap((activeId) => this.#eventsService.getAllById$(n_from(activeId))),
      ),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#eventsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  clone(eventId: number): void {
    this.#eventsService.clone$(eventId).subscribe();
  }
}

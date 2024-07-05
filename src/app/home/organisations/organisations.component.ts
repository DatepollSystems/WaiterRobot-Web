import {UpperCasePipe} from '@angular/common';
import {Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_ORGS_ALL' | transloco }}</h1>

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

        <div class="input-group action-search">
          <input class="form-control form-control-sm" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
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
                    (change)="selection.toggle(selectable, $event)"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="street">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_ORGS_STREET' | transloco }} , {{ 'HOME_ORGS_STREETNUMBER' | transloco }}
              </th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.street }} {{ organisation.streetNumber }}</td>
            </ng-container>

            <ng-container ngbColumnDef="city">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_ORGS_CITY' | transloco }} , {{ 'HOME_ORGS_COUNTRY_CODE' | transloco }}
              </th>
              <td *ngbCellDef="let organisation" ngb-cell>
                {{ organisation.postalCode }} {{ organisation.city }}, {{ organisation.countryCode | uppercase }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let organisation" ngb-cell>
                <app-action-dropdown>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + organisation.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (mousedown)="delete.onDelete(organisation.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let organisation; columns: table.columnsToDisplay()" ngb-row [routerLink]="'../' + organisation.id"></tr>
          </table>
        </div>

        <app-progress-bar [show]="table.isLoading()" />

        <ngb-paginator [length]="dataSource.data.length" [pageSizeOptions]="[10, 20, 50]" />
      }
    </div>
  `,
  selector: 'app-all-organisations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UpperCasePipe,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
  ],
})
export class OrganisationsComponent {
  #organisationsService = inject(OrganisationsService);

  sort = viewChild(NgbSort);
  paginator = viewChild(NgbPaginator);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['id', 'name', 'street', 'city', 'actions'],
    fetchData: () => this.#organisationsService.getAll$(),
    sort: this.sort,
    paginator: this.paginator,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#organisationsService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });
}

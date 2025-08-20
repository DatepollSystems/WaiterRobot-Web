import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {APIType} from '../../../api';
import {AppProgressBarComponent} from '../../../components/loading/app-progress-bar.component';
import {ScrollableToolbarComponent} from '../../../components/scrollable-toolbar.component';
import {AppActivatedPipe} from '../../../pipes/app-activated.pipe';
import {UsersService} from '../../../services/users/users.service';
import {ListFilterComponent, injectTable, injectTableDelete, injectTableFilter} from '../../../util/list';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_USERS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a class="btn btn-sm btn-success" routerLink="../create">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <app-list-filter [filter]="filter" />
      </scrollable-toolbar>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort ngbSortActive="id" ngbSortDirection="asc">
            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let user" ngb-cell>{{ user.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAME' | transloco }}
              </th>
              <td *ngbCellDef="let user" ngb-cell>{{ user.firstname }} {{ user.surname }}</td>
            </ng-container>

            <ng-container ngbColumnDef="email_address">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'EMAIL' | transloco }}
              </th>
              <td *ngbCellDef="let user" ngb-cell>{{ user.emailAddress }}</td>
            </ng-container>

            <ng-container ngbColumnDef="is_admin">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_USERS_ADMIN' | transloco }}
              </th>
              <td *ngbCellDef="let user" ngb-cell>
                {{ user.role === 'ADMIN' | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="activated">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'HOME_USERS_ACTIVATED' | transloco }}
              </th>
              <td *ngbCellDef="let user" ngb-cell>
                {{ user.activated | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'ACTIONS' | transloco }}
              </th>
              <td *ngbCellDef="let user" ngb-cell>
                <a
                  class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                  [routerLink]="'../' + user.id"
                  [ngbTooltip]="'EDIT' | transloco"
                >
                  <bi name="pencil-square" />
                </a>
                <button
                  class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                  [ngbTooltip]="'DELETE' | transloco"
                  (mousedown)="delete.onDelete(user.id)"
                  type="button"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let user; columns: table.columnsToDisplay()" [routerLink]="'../' + user.id" ngb-row></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    ScrollableToolbarComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
    ListFilterComponent,
  ],
})
export class UsersPage {
  #usersService = inject(UsersService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['id', 'name', 'email_address', 'is_admin', 'activated', 'actions'],
    fetchData: () => this.#usersService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  delete = injectTableDelete<APIType['GetUserResponse']>({
    delete$: (id) => this.#usersService.delete$(id),
  });
}

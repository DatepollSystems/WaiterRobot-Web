import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-list-with-delete.component';
import {GetUserResponse} from '../../_shared/waiterrobot-backend';

import {UsersService} from './services/users.service';

@Component({
  template: `
    <h1>{{ 'NAV_USERS' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <i-bs name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>
    </btn-toolbar>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="id" ngbSortDirection="asc">
        <ng-container ngbColumnDef="id">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.id }}</td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.firstname }} {{ user.surname }}</td>
        </ng-container>

        <ng-container ngbColumnDef="email_address">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'EMAIL' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.emailAddress }}</td>
        </ng-container>

        <ng-container ngbColumnDef="birthday">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_BIRTHDAY' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.birthday | date: 'dd.MM.YYYY' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="is_admin">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ADMIN' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                onclick="return false;"
                type="checkbox"
                [checked]="user.role === 'ADMIN'"
                name="is_admin"
                value=""
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="activated">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ACTIVATED' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                onclick="return false;"
                type="checkbox"
                [checked]="user.activated"
                name="activated"
                value=""
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ user.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(user.id, $event)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let user; columns: columnsToDisplay" ngb-row routerLink="../{{ user.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-all-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    DatePipe,
    NgIf,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
  ],
})
export class AllUsersComponent extends AbstractModelsListWithDeleteComponent<GetUserResponse> {
  constructor(private usersService: UsersService) {
    super(usersService);
    this.columnsToDisplay = ['id', 'name', 'email_address', 'birthday', 'is_admin', 'activated', 'actions'];
  }

  override selectionEnabled = false;
  override nameMap = (it: GetUserResponse) => `${it.firstname} ${it.surname}`;
}

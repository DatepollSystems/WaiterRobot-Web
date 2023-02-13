import {DatePipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {UserModel} from './_models/user.model';

import {UsersService} from './_services/users.service';

@Component({
  template: `
    <h1>{{ 'HOME_USERS_ALL' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>

      <div>
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection!.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash"></i-bs>
          {{ 'DELETE' | tr }}
        </button>
      </div>
    </btn-toolbar>

    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <form [hidden]="!entitiesLoaded">
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="filter?.value?.length > 0">
          <i-bs name="x-circle-fill"></i-bs>
        </button>
      </div>
    </form>

    <div class="table-responsive" [hidden]="!entitiesLoaded">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="id" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection!.hasValue() && isAllSelected()" />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection!.toggle(selectable) : null"
                [checked]="selection!.isSelected(selectable)" />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="id">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.id }}</td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="email_address">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'EMAIL' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.emailAddress }}</td>
        </ng-container>

        <ng-container ngbColumnDef="birthday">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_BIRTHDAY' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>{{ user.birthday | date : 'dd.MM.YYYY' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="is_admin">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ADMIN' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>
            <div class="form-check">
              <input class="form-check-input" onclick="return false;" type="checkbox" [ngModel]="user.isAdmin" name="is_admin" value="" />
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
                [ngModel]="user.activated"
                name="activated"
                value="" />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let user" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ user.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square"></i-bs>
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(user.id, $event)">
              <i-bs name="trash"></i-bs>
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let user; columns: columnsToDisplay" ngb-row routerLink="../{{ user.id }}"></tr>
      </table>
    </div>
  `,
  selector: 'app-all-users',
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
  standalone: true,
})
export class AllUsersComponent extends AbstractModelsListComponent<UserModel> {
  override columnsToDisplay = ['id', 'name', 'email_address', 'birthday', 'is_admin', 'activated', 'actions'];

  constructor(usersService: UsersService) {
    super(usersService);
    this.setSelectable();
  }
}

import {AsyncPipe, NgIf, UpperCasePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/button/app-btn-toolbar.component';
import {AppSelectableBtnComponent} from '../../_shared/ui/button/app-selectable-btn.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetOrganisationResponse} from '../../_shared/waiterrobot-backend';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  template: `
    <h1>{{ 'HOME_ORGS_ALL' | tr }}</h1>

    <ng-container *ngSub="myUser$ as myUser">
      <btn-toolbar *ngIf="myUser?.isAdmin">
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div>
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="(filter.value?.length ?? 0) > 0"
          >
            <bi name="x-circle-fill" />
          </button>
        </div>
      </form>

      <ng-container *ngIf="dataSource$ | async as dataSource">
        <div class="table-responsive">
          <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell [class.d-none]="!myUser?.isAdmin">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    (change)="$event ? toggleAllRows() : null"
                    [checked]="selection.hasValue() && isAllSelected()"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell [class.d-none]="!myUser?.isAdmin">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(selectable) : null"
                    [checked]="selection.isSelected(selectable)"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="street">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREET' | tr }}, {{ 'HOME_ORGS_STREETNUMBER' | tr }}</th>
              <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.street }} {{ organisation.streetNumber }}</td>
            </ng-container>

            <ng-container ngbColumnDef="city">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_CITY' | tr }}, {{ 'HOME_ORGS_COUNTRY_CODE' | tr }}</th>
              <td *ngbCellDef="let organisation" ngb-cell>
                {{ organisation.postalCode }} {{ organisation.city }}, {{ organisation.countryCode | uppercase }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
              <td *ngbCellDef="let organisation" ngb-cell>
                <selectable-button class="me-2" [entity]="organisation" [selectedEntityService]="organisationsService" />
                <a
                  class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
                  routerLink="../{{ organisation.id }}"
                  ngbTooltip="{{ 'EDIT' | tr }}"
                >
                  <bi name="pencil-square" />
                </a>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger text-body-emphasis"
                  ngbTooltip="{{ 'DELETE' | tr }}"
                  (click)="onDelete(organisation.id, $event)"
                  *ngIf="myUser?.isAdmin"
                >
                  <bi name="trash" />
                </button>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
            <tr *ngbRowDef="let organisation; columns: columnsToDisplay" ngb-row routerLink="../{{ organisation.id }}"></tr>
          </table>
        </div>
        <ngb-paginator [collectionSize]="dataSource.data.length" />
      </ng-container>
      <app-spinner-row [show]="isLoading" />
    </ng-container>
  `,
  selector: 'app-all-organisations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UpperCasePipe,
    NgSub,
    NgIf,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    BiComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppSelectableBtnComponent,
    AsyncPipe,
  ],
})
export class AllOrganisationsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetOrganisationResponse> {
  myUser$ = inject(MyUserService).getUser$();

  constructor(public organisationsService: OrganisationsService) {
    super(organisationsService);

    this.columnsToDisplay = ['id', 'name', 'street', 'city', 'actions'];
  }
}

import {NgIf, UpperCasePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';

import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../_shared/ui/app-selectable-button.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

import {OrganisationModel} from './_models/organisation.model';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  template: `
    <h1>{{ 'HOME_ORGS_ALL' | tr }}</h1>

    <ng-container *ngSub="myUser$ as myUser">
      <btn-toolbar *ngIf="myUser.isAdmin">
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

      <div class="table-responsive" [hidden]="!entitiesLoaded" *ngSub="selectedOrganisation$ as selectedOrganisation">
        <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell [class.d-none]="!myUser?.isAdmin">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection!.hasValue() && isAllSelected()" />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell [class.d-none]="!myUser?.isAdmin">
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
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.id }}</td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="street">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREET' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.street }}</td>
          </ng-container>

          <ng-container ngbColumnDef="streetNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREETNUMBER' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.streetNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="postalCode">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_POSTAL_CODE' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.postalCode }}</td>
          </ng-container>

          <ng-container ngbColumnDef="city">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_CITY' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.city }}</td>
          </ng-container>

          <ng-container ngbColumnDef="countryCode">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_COUNTRY_CODE' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>{{ organisation.countryCode | uppercase }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let organisation" ngb-cell>
              <selectable-button
                class="me-2"
                [selectedEntity]="selectedOrganisation"
                [entity]="organisation"
                [selectedEntityService]="organisationsService"></selectable-button>
              <a
                class="btn btn-sm me-2 btn-outline-success text-white"
                routerLink="../{{ organisation.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}">
                <i-bs name="pencil-square"></i-bs>
              </a>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger text-white"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(organisation.id, $event)"
                *ngIf="myUser?.isAdmin">
                <i-bs name="trash"></i-bs>
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let organisation; columns: columnsToDisplay" ngb-row routerLink="../{{ organisation.id }}"></tr>
        </table>
        <ngb-paginator [collectionSize]="dataSource.data.length"></ngb-paginator>
      </div>
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
    AppIconsModule,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppSelectableButtonComponent,
  ],
})
export class AllOrganisationsComponent extends AbstractModelsListComponent<OrganisationModel> {
  override columnsToDisplay = ['id', 'name', 'street', 'streetNumber', 'postalCode', 'city', 'countryCode', 'actions'];

  myUser$ = inject(MyUserService).getUser$();

  selectedOrganisation$ = this.organisationsService.getSelected$;

  constructor(public organisationsService: OrganisationsService) {
    super(organisationsService);
    this.setSelectable();
  }
}

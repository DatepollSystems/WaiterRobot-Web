import {AsyncPipe, UpperCasePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetOrganisationResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {AppSelectableBtnComponent} from '../_shared/components/button/app-selectable-btn.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {MyUserService} from '../_shared/services/user/my-user.service';
import {OrganisationsService} from './_services/organisations.service';
import {SelectedOrganisationService} from './_services/selected-organisation.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_ORGS_ALL' | transloco }}</h1>

      @if (myUser()?.isAdmin) {
        <scrollable-toolbar>
          <div>
            <a routerLink="../create" class="btn btn-sm btn-success">
              <bi name="plus-circle" />
              {{ 'ADD_2' | transloco }}</a
            >
          </div>

          <div>
            <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>
      }

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | transloco" />
          @if ((filter.value?.length ?? 0) > 0) {
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
      </form>

      @if (dataSource$ | async; as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell [class.d-none]="!myUser()?.isAdmin">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    [checked]="selection.hasValue() && isAllSelected()"
                    (change)="$event ? toggleAllRows() : null"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell [class.d-none]="!myUser()?.isAdmin" (click)="$event.stopPropagation()">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    [checked]="selection.isSelected(selectable)"
                    (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(selectable) : null"
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
                <selectable-button
                  class="me-2"
                  placement="top"
                  [entityId]="organisation.id"
                  [selectedId]="selectedOrganisationService.selectedId()"
                  (selectedChange)="setSelected($event)"
                />
                <app-action-dropdown>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    [routerLink]="'../' + organisation.id"
                    [queryParams]="{tab: 'USERS'}"
                  >
                    <bi name="people" />
                    {{ 'USER' | transloco }}
                  </a>
                  <a
                    type="button"
                    class="d-flex gap-2 align-items-center"
                    ngbDropdownItem
                    [routerLink]="'../' + organisation.id"
                    [queryParams]="{tab: 'SETTINGS'}"
                  >
                    <bi name="gear" />
                    {{ 'SETTINGS' | transloco }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + organisation.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  @if (myUser()?.isAdmin) {
                    <button
                      type="button"
                      class="d-flex gap-2 align-items-center text-danger-emphasis"
                      ngbDropdownItem
                      (click)="onDelete(organisation.id, $event)"
                    >
                      <bi name="trash" />
                      {{ 'DELETE' | transloco }}
                    </button>
                  }
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
            <tr *ngbRowDef="let organisation; columns: columnsToDisplay" ngb-row [routerLink]="'../' + organisation.id"></tr>
          </table>
        </div>

        <app-progress-bar [show]="isLoading()" />

        <ngb-paginator [length]="dataSource.data.length" />
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
    AppSelectableBtnComponent,
    AsyncPipe,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class OrganisationsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetOrganisationResponse> {
  myUser = inject(MyUserService).user;
  selectedOrganisationService = inject(SelectedOrganisationService);

  constructor(public organisationsService: OrganisationsService) {
    super(organisationsService);
    this.columnsToDisplay = ['id', 'name', 'street', 'city', 'actions'];
  }

  setSelected(it: number | undefined): void {
    this.selectedOrganisationService.setSelected(it);
  }
}

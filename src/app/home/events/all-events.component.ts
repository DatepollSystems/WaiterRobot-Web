import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../_shared/ui/app-selectable-button.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';

import {EventsService} from './_services/events.service';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetEventOrLocationResponse} from '../../_shared/waiterrobot-backend';

@Component({
  template: `
    <h1>{{ 'NAV_EVENTS' | tr }}</h1>

    <ng-container *ngSub="myUser$ as myUser">
      <btn-toolbar *ngIf="myUser?.isAdmin">
        <div>
          <a routerLink="../create" class="btn btn-sm btn-outline-success">
            <i-bs name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div>
          <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
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
            *ngIf="(filter.value?.length ?? 0) > 0"
          >
            <i-bs name="x-circle-fill" />
          </button>
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="date" ngbSortDirection="desc">
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

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="date">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'DATE' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.date | date : 'dd.MM.YYYY' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="street">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREET' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.street }}</td>
          </ng-container>

          <ng-container ngbColumnDef="streetNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREETNUMBER' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.streetNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="postalCode">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_POSTAL_CODE' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.postalCode }}</td>
          </ng-container>

          <ng-container ngbColumnDef="city">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_CITY' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.city }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>
              <selectable-button class="me-2" [entity]="event" [selectedEntityService]="eventsService" />
              <a class="btn btn-sm me-2 btn-outline-success text-white" routerLink="../{{ event.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
                <i-bs name="pencil-square" />
              </a>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger text-white"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(event.id, $event)"
                *ngIf="myUser?.isAdmin"
              >
                <i-bs name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row routerLink="../{{ event.id }}"></tr>
        </table>
      </div>

      <app-spinner-row [show]="isLoading" />
    </ng-container>
  `,
  selector: 'app-all-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    NgSub,
    NgIf,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppSelectableButtonComponent,
    AppBtnToolbarComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class AllEventsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetEventOrLocationResponse> {
  myUser$ = inject(MyUserService).getUser$();

  constructor(public eventsService: EventsService) {
    super(eventsService);

    this.columnsToDisplay = ['name', 'date', 'street', 'streetNumber', 'postalCode', 'city', 'actions'];
  }
}

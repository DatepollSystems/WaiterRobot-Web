import {DatePipe, NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';

import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSelectableButtonComponent} from '../../_shared/ui/app-selectable-button.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {EventModel} from './_models/event.model';

import {EventsService} from './_services/events.service';

@Component({
  template: `
    <h1>{{ 'NAV_EVENTS' | tr }}</h1>

    <ng-container *ngSub="myUser$; let myUser">
      <btn-toolbar *ngIf="myUser?.isAdmin">
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

      <div class="table-responsive" [hidden]="!entitiesLoaded" *ngSub="selectedEvent$ as selectedEvent">
        <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="date" ngbSortDirection="desc">
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
              <selectable-button
                class="me-2"
                [selectedEntity]="selectedEvent"
                [entity]="event"
                [selectedEntityService]="eventsService"></selectable-button>
              <a class="btn btn-sm me-2 btn-outline-success text-white" routerLink="../{{ event.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
                <i-bs name="pencil-square"></i-bs>
              </a>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger text-white"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(event.id, $event)"
                *ngIf="myUser?.isAdmin">
                <i-bs name="trash"></i-bs>
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row routerLink="../{{ event.id }}"></tr>
        </table>
      </div>
    </ng-container>
  `,
  selector: 'app-all-events',
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
  ],
  standalone: true,
})
export class AllEventsComponent extends AbstractModelsListComponent<EventModel> {
  override columnsToDisplay = ['name', 'date', 'street', 'streetNumber', 'postalCode', 'city', 'actions'];

  myUser$ = inject(MyUserService).getUser$();
  selectedEvent$ = this.eventsService.getSelected$;

  constructor(public eventsService: EventsService) {
    super(eventsService);

    this.setSelectable();
  }
}

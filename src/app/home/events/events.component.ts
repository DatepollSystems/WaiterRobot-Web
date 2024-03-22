import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetEventOrLocationResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {AppSelectableBtnComponent} from '../_shared/components/button/app-selectable-btn.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {MyUserService} from '../_shared/services/user/my-user.service';
import {EventsService} from './_services/events.service';
import {SelectedEventService} from './_services/selected-event.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_EVENTS' | transloco }}</h1>

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

      <div class="table-responsive">
        <table ngb-table ngb-sort ngbSortActive="date" ngbSortDirection="desc" [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
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
            <td *ngbCellDef="let selectable" ngb-cell [class.d-none]="!myUser()?.isAdmin">
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
              <selectable-button
                class="me-2"
                placement="top"
                [entityId]="event.id"
                [selectedId]="selectedEventService.selectedId()"
                (selectedChange)="selectedEventService.setSelected($event)"
              />
              @if (myUser()?.isAdmin) {
                <app-action-dropdown>
                  <button type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem (click)="clone(event.id)">
                    <bi name="clipboard" />
                    {{ 'COPY' | transloco }}
                  </button>
                  <div class="dropdown-divider"></div>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + event.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (click)="onDelete(event.id.id, $event)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              }
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row [routerLink]="'../' + event.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
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
    AppSelectableBtnComponent,
    ScrollableToolbarComponent,
    AsyncPipe,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
  standalone: true,
})
export class EventsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetEventOrLocationResponse> {
  myUser = inject(MyUserService).user;
  selectedEventService = inject(SelectedEventService);

  constructor(public eventsService: EventsService) {
    super(eventsService);

    this.columnsToDisplay = ['name', 'startDate', 'endDate', 'street', 'city', 'actions'];
  }

  clone(eventId: number): void {
    this.eventsService.clone$(eventId).subscribe();
  }
}

import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppSelectableBtnComponent} from '../../_shared/ui/button/app-selectable-btn.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetEventOrLocationResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from './_services/events.service';
import {SelectedEventService} from './_services/selected-event.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_EVENTS' | tr }}</h1>

      @if (myUser()?.isAdmin) {
        <scrollable-toolbar>
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
        </scrollable-toolbar>
      }

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          @if ((filter.value?.length ?? 0) > 0) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              ngbTooltip="{{ 'CLEAR' | tr }}"
              placement="bottom"
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="date" ngbSortDirection="desc">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell [class.d-none]="!myUser()?.isAdmin">
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
            <td *ngbCellDef="let selectable" ngb-cell [class.d-none]="!myUser()?.isAdmin">
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

          <ng-container ngbColumnDef="startDate">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_EVENTS_START_DATE' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.startDate | date: 'dd.MM.yyyy HH:mm' : 'UTC' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="endDate">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_EVENTS_END_DATE' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.endDate | date: 'dd.MM.yyyy HH:mm' : 'UTC' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="street">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_STREET' | tr }} {{ 'HOME_ORGS_STREETNUMBER' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.street }}, {{ event.streetNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="city">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_CITY' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>{{ event.postalCode }}, {{ event.city }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let event" ngb-cell>
              <selectable-button
                class="me-2"
                placement="top"
                [entityId]="event.id"
                [selectedId]="selectedEventService.selectedId()"
                (selectedChange)="selectedEventService.setSelected($event)"
              />
              <a
                class="btn btn-sm me-2 btn-outline-success text-body-emphasis"
                routerLink="../{{ event.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}"
              >
                <bi name="pencil-square" />
              </a>
              @if (myUser()?.isAdmin) {
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary text-body-emphasis me-2"
                  ngbTooltip="{{ 'COPY' | tr }}"
                  (click)="$event.stopPropagation(); clone(event.id)"
                >
                  <bi name="clipboard" />
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger text-body-emphasis"
                  ngbTooltip="{{ 'DELETE' | tr }}"
                  (click)="onDelete(event.id, $event)"
                >
                  <bi name="trash" />
                </button>
              }
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let event; columns: columnsToDisplay" ngb-row routerLink="../{{ event.id }}"></tr>
        </table>
      </div>

      <app-progress-bar [hidden]="!isLoading()" />
    </div>
  `,
  selector: 'app-all-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    BiComponent,
    AppSelectableBtnComponent,
    ScrollableToolbarComponent,
    AsyncPipe,
    AppProgressBarComponent,
  ],
  standalone: true,
})
export class AllEventsComponent extends AbstractModelsWithNameListWithDeleteComponent<GetEventOrLocationResponse> {
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

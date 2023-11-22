import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppActivatedPipe} from '../../_shared/ui/app-activated.pipe';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppProgressBarComponent} from '../../_shared/ui/loading/app-progress-bar.component';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-list-with-delete.component';
import {GetSystemNotificationResponse} from '../../_shared/waiterrobot-backend';
import {AppSystemNotificationTypeBadgeComponent} from './_components/system-notification-type-badge.component';
import {SystemNotificationsService} from './_services/system-notifications.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_SYSTEM_NOTIFICATIONS' | tr }}</h1>

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
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="id" ngbSortDirection="asc">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
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
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? selection.toggle(selectable) : null"
                  [checked]="selection.isSelected(selectable)"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="title">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TITLE' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.title }}</td>
          </ng-container>

          <ng-container ngbColumnDef="type">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TYPE' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>
              <app-system-notification-type-badge [type]="it.type" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="starts">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STARTS' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.starts | date: 'dd.MM.YYYY HH:mm' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="ends">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ENDS' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.ends | date: 'dd.MM.YYYY HH:mm' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="active">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIVE' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>
              {{ it.active | activated }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>
              <a class="btn btn-sm m-1 btn-outline-success text-body-emphasis" routerLink="../{{ it.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
                <bi name="pencil-square" />
              </a>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(it.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let it; columns: columnsToDisplay" ngb-row routerLink="../{{ it.id }}"></tr>
        </table>
      </div>

      <app-progress-bar [hidden]="!isLoading()" />
    </div>
  `,
  selector: 'app-all-system-notifications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    DatePipe,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    BiComponent,
    ScrollableToolbarComponent,
    AppSystemNotificationTypeBadgeComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
  ],
})
export class AllSystemNotificationsComponent extends AbstractModelsListWithDeleteComponent<GetSystemNotificationResponse> {
  constructor(private systemNotificationsService: SystemNotificationsService) {
    super(systemNotificationsService);
    this.columnsToDisplay = ['title', 'type', 'starts', 'ends', 'active', 'actions'];
  }

  override nameMap = (it: GetSystemNotificationResponse): string => it.title ?? it.type;
}

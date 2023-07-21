import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {SessionModel} from '../../../_shared/model/session.model';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListByIdComponent} from '../../../_shared/ui/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {GetWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {WaiterSessionsService} from '../_services/waiter-sessions.service';
import {WaitersService} from '../_services/waiters.service';

@Component({
  template: `
    <form class="d-flex flex-column flex-sm-row gap-2">
      <div class="flex-grow-1">
        <div class="input-group">
          <input class="form-control bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
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
      </div>

      <button class="btn btn-sm btn-outline-danger" type="button" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
        <i-bs name="trash" />
        {{ 'DELETE' | tr }}
      </button>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="updatedAt" ngbSortDirection="desc">
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
          <td *ngbCellDef="let selectable" ngb-cell>
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
          <td *ngbCellDef="let session" ngb-cell>{{ session.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="registeredAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_REGISTERED_AT' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.registeredAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="updatedAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.updatedAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              placement="left"
              (click)="onDelete(session.id)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let session; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-waiter-sessions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    AsyncPipe,
    NgIf,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
  ],
})
export class WaiterSessionsComponent extends AbstractModelsWithNameListByIdComponent<SessionModel, GetWaiterResponse> {
  constructor(sessionsService: WaiterSessionsService, waitersService: WaitersService) {
    super(sessionsService, waitersService);

    this.columnsToDisplay = ['name', 'registeredAt', 'updatedAt', 'actions'];
  }
}

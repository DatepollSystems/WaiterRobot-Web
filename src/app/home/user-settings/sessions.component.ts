import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {SessionModel} from '../../_shared/model/session.model';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {UserSessionsService} from './_services/user-sessions.service';

@Component({
  template: `
    <h1>{{ 'NAV_USER_SESSIONS' | tr }}</h1>

    <scrollable-toolbar>
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
              class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
              ngbTooltip="{{ 'DELETE' | tr }}"
              placement="left"
              (click)="onDelete(session.id)"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let session; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-sessions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    NgIf,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    BiComponent,
    AppSpinnerRowComponent,
    ScrollableToolbarComponent,
  ],
})
export class SessionsComponent extends AbstractModelsWithNameListWithDeleteComponent<SessionModel> {
  constructor(sessionsService: UserSessionsService) {
    super(sessionsService);

    this.columnsToDisplay = ['name', 'registeredAt', 'updatedAt', 'actions'];
  }
}

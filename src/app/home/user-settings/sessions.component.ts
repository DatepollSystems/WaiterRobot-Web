import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {SessionModel} from '@shared/model/session.model';
import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {UserSessionsService} from './_services/user-sessions.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-2">
      <h1 class="my-0">{{ 'NAV_USER_SESSIONS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

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
        <table
          ngb-table
          ngb-sort
          ngbSortActive="updatedAt"
          ngbSortDirection="desc"
          [hover]="true"
          [dataSource]="(dataSource$ | async) ?? []"
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
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
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
            <td *ngbCellDef="let session" ngb-cell>{{ session.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="registeredAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_REGISTERED_AT' | transloco }}</th>
            <td *ngbCellDef="let session" ngb-cell>{{ session.registeredAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="updatedAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | transloco }}</th>
            <td *ngbCellDef="let session" ngb-cell>{{ session.updatedAt | date: 'YYYY.MM.dd - HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
            <td *ngbCellDef="let session" ngb-cell>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                placement="left"
                [ngbTooltip]="'DELETE' | transloco"
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

      <app-spinner-row [show]="isLoading()" />
    </div>
  `,
  selector: 'app-sessions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
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

import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {AbstractModelsListComponent} from '@home-shared/list/abstract-models-list.component';
import {StopPropagationDirective} from '@home-shared/stop-propagation';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {TempNotification} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCutPipe} from 'dfx-helper';

import {TmpNotificationsService} from './tmp-notifications.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_TMP_NOTIFICATIONS' | transloco }}</h1>

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
          ngbSortActive="createdAt"
          ngbSortDirection="asc"
          [hover]="true"
          [dataSource]="(dataSource$ | async) ?? []"
        >
          <ng-container ngbColumnDef="id">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Id' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.id | s_cut: 20 : '...' }}</td>
          </ng-container>
          <ng-container ngbColumnDef="to">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'To' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.to }}</td>
          </ng-container>

          <ng-container ngbColumnDef="subject">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Subject' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.subject }}</td>
          </ng-container>

          <ng-container ngbColumnDef="body">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Body' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.body | s_cut: 60 : '...' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.createdAt | date: 'dd.MM.YY HH:mm:ss:SSS' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIONS' | transloco }}</th>
            <td *ngbCellDef="let it" ngb-cell>
              <a stopPropagation class="btn btn-sm btn-outline-primary" [routerLink]="'../view/' + it.id">
                <bi name="arrow-up-right-square" />
              </a>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let it; columns: columnsToDisplay" ngb-row [routerLink]="'../view/' + it.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  selector: 'app-all-dead-letters',
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
    TranslocoPipe,
    BiComponent,
    DfxCutPipe,
    AppProgressBarComponent,
    StopPropagationDirective,
  ],
})
export class TmpNotificationsComponent extends AbstractModelsListComponent<TempNotification> {
  constructor(public deadLettersService: TmpNotificationsService) {
    super(deadLettersService);
    this.columnsToDisplay = ['id', 'to', 'subject', 'body', 'createdAt', 'actions'];
  }
}

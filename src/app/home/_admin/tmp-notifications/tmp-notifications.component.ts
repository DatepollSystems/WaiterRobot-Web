import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {injectTable, injectTableFilter} from '@home-shared/list';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxCutPipe, StopPropagationDirective} from 'dfx-helper';

import {TmpNotificationsService} from './tmp-notifications.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_TMP_NOTIFICATIONS' | transloco }}</h1>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (mousedown)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort ngbSortActive="createdAt" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource">
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

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let it; columns: table.columnsToDisplay()" ngb-row [routerLink]="'../view/' + it.id"></tr>
          </table>
        </div>
      }

      @if (table.error()) {
        <span class="alert alert-warning">
          <bi name="bell-slash-fill" />
          TMP-Notifications disabled
        </span>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-dead-letters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxCutPipe,
    TranslocoPipe,
    BiComponent,
    AppProgressBarComponent,
    StopPropagationDirective,
  ],
})
export class TmpNotificationsComponent {
  #tmpNotificationsService = inject(TmpNotificationsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['id', 'to', 'subject', 'body', 'createdAt', 'actions'],
    fetchData: () => this.#tmpNotificationsService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
    redirectOnError: false,
  });
}

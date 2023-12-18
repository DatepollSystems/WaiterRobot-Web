import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCutPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../../_shared/ui/loading/app-progress-bar.component';
import {TempNotification} from '../../../_shared/waiterrobot-backend';
import {AbstractModelsListComponent} from '../../_shared/list/abstract-models-list.component';
import {TmpNotificationsService} from './tmp-notifications.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_TMP_NOTIFICATIONS' | tr }}</h1>

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
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="id" ngbSortDirection="desc">
          <ng-container ngbColumnDef="to">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'To' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.to }}</td>
          </ng-container>

          <ng-container ngbColumnDef="subject">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Subject' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.subject }}</td>
          </ng-container>

          <ng-container ngbColumnDef="body">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Body' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.body | s_cut: 60 : '...' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let it; columns: columnsToDisplay" ngb-row routerLink="../view" (click)="deadLettersService.single.set(it)"></tr>
        </table>
      </div>

      <app-progress-bar [hidden]="!isLoading()" />
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
    DfxTr,
    BiComponent,
    DfxCutPipe,
    AppProgressBarComponent,
  ],
})
export class AllTmpNotificationsComponent extends AbstractModelsListComponent<TempNotification> {
  constructor(public deadLettersService: TmpNotificationsService) {
    super(deadLettersService);
    this.columnsToDisplay = ['to', 'subject', 'body', 'createdAt'];
  }
}

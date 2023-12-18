import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCutPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../../_shared/ui/loading/app-progress-bar.component';
import {DeadLetterResponse} from '../../../_shared/waiterrobot-backend';
import {ScrollableToolbarComponent} from '../../_shared/components/scrollable-toolbar.component';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/list/models-list-with-delete/abstract-models-list-with-delete.component';
import {DeadLettersService} from './dead-letters.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'Dead Letters' | tr }}</h1>

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

          <ng-container ngbColumnDef="id">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.id }}</td>
          </ng-container>

          <ng-container ngbColumnDef="queue">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Queue' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.queue }}</td>
          </ng-container>

          <ng-container ngbColumnDef="exchange">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Exchange' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.exchange }}</td>
          </ng-container>

          <ng-container ngbColumnDef="body">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Body' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.body | s_cut: 60 : '...' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let it" ngb-cell>{{ it.createdAt | date: 'dd.MM.YYYY HH:mm:ss:SSS' }}</td>
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
    ScrollableToolbarComponent,
    AppProgressBarComponent,
  ],
})
export class AllDeadLettersComponent extends AbstractModelsListWithDeleteComponent<DeadLetterResponse> {
  constructor(deadLettersService: DeadLettersService) {
    super(deadLettersService);
    this.columnsToDisplay = ['id', 'queue', 'exchange', 'body', 'createdAt'];
  }

  override nameMap = (it: DeadLetterResponse): string => s_from(it.id);
}

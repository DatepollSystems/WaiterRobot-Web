import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AbstractModelsListComponent} from '@home-shared/list/abstract-models-list.component';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DuplicateWaiterResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_WAITERS_DUPLICATES' | tr }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../" class="btn btn-sm btn-outline-secondary">{{ 'GO_BACK' | tr }}</a>
        </div>
      </scrollable-toolbar>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | tr" />
          @if ((filter.value?.length ?? 0) > 0) {
            <button class="btn btn-outline-secondary" type="button" placement="bottom" [ngbTooltip]="'CLEAR' | tr" (click)="filter.reset()">
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table ngb-sort [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let duplicateWaiter" ngb-cell>{{ duplicateWaiter.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="count">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'COUNT' | tr }}</th>
            <td *ngbCellDef="let duplicateWaiter" ngb-cell>
              {{ duplicateWaiter.waiters.length }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let duplicateWaiter" ngb-cell>
              <a
                class="btn btn-sm m-1 btn-outline-danger"
                [routerLink]="'./merge/&quot;' + duplicateWaiter.name + '&quot;'"
                [ngbTooltip]="'MERGE' | tr"
              >
                <bi name="union" />
              </a>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr
            *ngbRowDef="let duplicateWaiter; columns: columnsToDisplay"
            ngb-row
            class="clickable"
            [routerLink]="'./merge/&quot;' + duplicateWaiter.name + '&quot;'"
          ></tr>
        </table>
        @if (_dataSource.data.length < 1) {
          <div class="text-center fs-3">Keine Dupliakte gefunden!</div>
        }
      </div>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    BiComponent,
    ScrollableToolbarComponent,
  ],
  selector: 'app-duplicate-organisation-waiters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DuplicateOrganisationWaitersComponent extends AbstractModelsListComponent<DuplicateWaiterResponse> {
  constructor(protected entitiesService: DuplicateWaitersService) {
    super(entitiesService);

    this.columnsToDisplay = ['name', 'count', 'actions'];
  }
}

import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTable, injectTableFilter} from '@home-shared/list';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_WAITERS_DUPLICATES' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../" class="btn btn-sm btn-outline-secondary">{{ 'GO_BACK' | transloco }}</a>
        </div>
      </scrollable-toolbar>

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
          <table ngb-table ngb-sort [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let duplicateWaiter" ngb-cell>{{ duplicateWaiter.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="count">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'COUNT' | transloco }}</th>
              <td *ngbCellDef="let duplicateWaiter" ngb-cell>
                {{ duplicateWaiter.waiters.length }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
              <td *ngbCellDef="let duplicateWaiter" ngb-cell>
                <a
                  class="btn btn-sm m-1 btn-outline-danger"
                  [routerLink]="'./merge/&quot;' + duplicateWaiter.name + '&quot;'"
                  [ngbTooltip]="'MERGE' | transloco"
                >
                  <bi name="union" />
                </a>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let duplicateWaiter; columns: table.columnsToDisplay()"
              ngb-row
              class="clickable"
              [routerLink]="'./merge/&quot;' + duplicateWaiter.name + '&quot;'"
            ></tr>
          </table>
        </div>
      }

      @if (table.isEmpty()) {
        <div class="text-center fs-4">Keine Duplikate gefunden!</div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
  ],
  selector: 'app-duplicate-organisation-waiters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DuplicateOrganisationWaitersComponent {
  #duplicateWaitersService = inject(DuplicateWaitersService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['name', 'count', 'actions'],
    fetchData: () => this.#duplicateWaitersService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });
}

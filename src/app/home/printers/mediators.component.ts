import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BlankslateComponent} from '@home-shared/components/blankslate.component';
import {injectTable, injectTableFilter} from '@home-shared/list';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {MediatorsService} from './_services/mediators.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PRINTER_NAV_MEDIATOR' | transloco }}</h1>

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter.control" [placeholder]="'SEARCH' | transloco" />
          @if (filter.isActive()) {
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

      @if (table.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table ngb-sort [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="active">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIVE' | transloco }}</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.active }}</td>
            </ng-container>

            <ng-container ngbColumnDef="lastContact">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'LAST_CONTACT' | transloco }}</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.lastContact | date: 'dd.MM.YYYY HH:mm:ss' }}</td>
            </ng-container>

            <ng-container ngbColumnDef="printers">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | transloco }}</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.printers | a_mapName | s_implode: ', ' : 20 : '...' }}</td>
            </ng-container>

            <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let mediator; columns: table.columnsToDisplay()" ngb-row></tr>
          </table>
        </div>
      }
      @if (table.isEmpty()) {
        <app-blankslate icon="wifi-off" [description]="'Keine Mediators verbunden'">
          <a class="btn btn-success" type="button" href="https://help.kellner.team/mediator.html" rel="noopener" target="_blank">
            {{ 'LEARN_MORE' | transloco }}
          </a>
        </app-blankslate>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-all-mediators',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    BiComponent,
    AppProgressBarComponent,
    BlankslateComponent,
  ],
})
export class MediatorsComponent {
  #mediatorsService = inject(MediatorsService);

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['id', 'name', 'active', 'lastContact', 'printers'],
    fetchData: () => this.#mediatorsService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });
}

import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';

import {BlankslateComponent} from '@home-shared/components/blankslate.component';
import {ListFilterComponent, injectTableFilter} from '@home-shared/list';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {MediatorStore} from './_services/mediator.store';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'HOME_PRINTER_NAV_MEDIATOR' | transloco }}</h1>

      <app-list-filter [filter]="filter" />

      @if (mediatorStore.dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table ngb-sort>
            <ng-container ngbColumnDef="id">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.id }}</td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAME' | transloco }}
              </th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="active">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'ACTIVE' | transloco }}
              </th>
              <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.active }}</td>
            </ng-container>

            <ng-container ngbColumnDef="lastContact">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'LAST_CONTACT' | transloco }}
              </th>
              <td *ngbCellDef="let mediator" ngb-cell>
                {{ mediator.lastContact | date: 'dd.MM.YYYY HH:mm:ss' }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="printers">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
                {{ 'NAV_PRINTERS' | transloco }}
              </th>
              <td *ngbCellDef="let mediator" ngb-cell>
                {{ mediator.printers | a_mapName | s_implode: ', ' : 20 : '...' }}
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="mediatorStore.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let mediator; columns: mediatorStore.columnsToDisplay()" ngb-row></tr>
          </table>
        </div>
      }
      @if (mediatorStore.isEmpty()) {
        <app-blankslate [description]="'Keine Mediators verbunden'" icon="wifi-off">
          <a class="btn btn-success" type="button" href="https://help.kellner.team/desktop.html" rel="noopener" target="_blank">
            {{ 'LEARN_MORE' | transloco }}
          </a>
        </app-blankslate>
      }

      <app-progress-bar [show]="mediatorStore.isPending()" />
    </div>
  `,
  selector: 'app-all-mediators',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    AppProgressBarComponent,
    BlankslateComponent,
    ListFilterComponent,
  ],
})
export class MediatorsComponent {
  readonly mediatorStore = inject(MediatorStore);
  readonly filter = injectTableFilter();

  readonly sort = viewChild(NgbSort);

  constructor() {
    this.mediatorStore.setFilter(this.filter.value);
    this.mediatorStore.setSort(this.sort);
    this.mediatorStore.loadAll();
  }
}

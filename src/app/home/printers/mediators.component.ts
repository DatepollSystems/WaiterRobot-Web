import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {GetMediatorResponse} from '../../_shared/waiterrobot-backend';
import {AbstractModelsListComponent} from '../_shared/list/abstract-models-list.component';
import {MediatorsService} from './_services/mediators.service';

@Component({
  template: `
    <h1>{{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</h1>

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
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort>
        <ng-container ngbColumnDef="id">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>#</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.id }}</td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="active">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIVE' | tr }}</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.active }}</td>
        </ng-container>

        <ng-container ngbColumnDef="lastContact">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'LAST_CONTACT' | tr }}</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.lastContact | date: 'dd.MM.YYYY HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="printers">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.printers | a_mapName | s_implode: ', ' : 20 : '...' }}</td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let mediator; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading()" />
  `,
  selector: 'app-all-mediators',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    DatePipe,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    BiComponent,
    AppSpinnerRowComponent,
  ],
})
export class MediatorsComponent extends AbstractModelsListComponent<GetMediatorResponse> {
  constructor(mediatorsService: MediatorsService) {
    super(mediatorsService);

    this.columnsToDisplay = ['id', 'name', 'active', 'lastContact', 'printers'];
  }
}
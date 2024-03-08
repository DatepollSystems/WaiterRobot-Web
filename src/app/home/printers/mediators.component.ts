import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';
import {GetMediatorResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {AbstractModelsListComponent} from '../_shared/list/abstract-models-list.component';
import {MediatorsService} from './_services/mediators.service';

@Component({
  template: `
    <h1>{{ 'HOME_PRINTER_NAV_MEDIATOR' | transloco }}</h1>

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
      <table ngb-table ngb-sort [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
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
    TranslocoPipe,
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

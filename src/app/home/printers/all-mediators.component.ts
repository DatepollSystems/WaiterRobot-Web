import {DatePipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

import {MediatorModel} from './_models/mediator.model';

import {MediatorsService} from './_services/mediators.service';

@Component({
  template: `
    <h1>{{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</h1>

    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <form [hidden]="!entitiesLoaded">
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="filter?.value?.length > 0">
          <i-bs name="x-circle-fill"></i-bs>
        </button>
      </div>
    </form>

    <div class="table-responsive" [hidden]="!entitiesLoaded">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort>
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
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.lastContact | date : 'dd.MM.YYYY HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="printers">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_PRINTERS' | tr }}</th>
          <td *ngbCellDef="let mediator" ngb-cell>{{ mediator.printers | a_mapName | s_implode : ', ' : 20 : '...' }}</td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let mediator; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>
  `,
  selector: 'app-all-mediators',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgIf,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    AppIconsModule,
    AppSpinnerRowComponent,
  ],
})
export class AllMediatorsComponent extends AbstractModelsListComponent<MediatorModel> {
  override columnsToDisplay = ['id', 'name', 'active', 'lastContact', 'printers'];

  constructor(mediatorsService: MediatorsService) {
    super(mediatorsService);
  }
}

import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractModelsListByIdComponent} from '../../_shared/ui/abstract-models-list-by-id.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

import {EventModel} from '../events/_models/event.model';

import {EventsService} from '../events/_services/events.service';
import {PrinterModel} from './_models/printer.model';
import {PrintersService} from './_services/printers.service';

@Component({
  template: `
    <h1>{{ entity?.name }} {{ 'NAV_PRINTERS' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../../create" class="btn btn-sm btn-outline-success m-1">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>
    </btn-toolbar>

    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <div [hidden]="!entitiesLoaded">
      <form>
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

      <div class="table-responsive">
        <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort>
          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="printerName">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_NAME' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.printerName }}</td>
          </ng-container>

          <ng-container ngbColumnDef="productGroups">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PROD_ALL' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.products | a_mapName | s_implode : ', ' : 20 : '...' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>
              <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../../{{ printer.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
                <i-bs name="pencil-square"></i-bs>
              </a>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-white"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(printer.id, $event)">
                <i-bs name="trash"></i-bs>
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let printer; columns: columnsToDisplay" ngb-row routerLink="../../{{ printer.id }}"></tr>
        </table>
      </div>
    </div>
  `,
  selector: 'app-event-by-id-printers',
  imports: [
    ReactiveFormsModule,
    NgIf,
    DfxTr,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
  ],
  standalone: true,
})
export class EventByIdPrintersComponent extends AbstractModelsListByIdComponent<PrinterModel, EventModel> {
  override columnsToDisplay = ['name', 'printerName', 'productGroups', 'actions'];
  override getAllParam = 'eventId';

  constructor(printersService: PrintersService, eventsService: EventsService) {
    super(printersService, eventsService);
  }
}

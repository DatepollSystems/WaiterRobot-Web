import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTable, injectTableDelete, injectTableFilter, injectTableSelect} from '@home-shared/list';
import {mapName} from '@home-shared/name-map';
import {NgbDropdownItem, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {loggerOf} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {forkJoin} from 'rxjs';

import {PrintersService} from './_services/printers.service';
import {PrinterBatchUpdateDto, PrintersBatchUpdateModal} from './printers-batch-update.modal';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_PRINTERS' | transloco }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | transloco }}</a
          >
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PRINTER_SELECT' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-danger" [disabled]="!selection.hasValue()" (mousedown)="delete.onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PRINTER_SELECT' | transloco) : undefined">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            [class.disabled]="!selection.hasValue()"
            (mousedown)="onBatchUpdatePrinters()"
          >
            <bi name="pencil-square" />
            {{ 'HOME_PRINTER_BATCH_UPDATE' | transloco }}
          </button>
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
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="selectAll"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="select"
                    [checked]="selection.isSelected(selectable)"
                    (change)="selection.toggle(selectable, $event)"
                  />
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.name }}</td>
            </ng-container>

            <ng-container ngbColumnDef="fontScale">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_FONT_SCALE' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.fontScale }}</td>
            </ng-container>

            <ng-container ngbColumnDef="font">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_FONT' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.font.description }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonWidth">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_WIDTH' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonWidth }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonPadding">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPadding }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonPaddingTop">
              <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING_TOP' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPaddingTop }}</td>
            </ng-container>

            <ng-container ngbColumnDef="actions">
              <th *ngbHeaderCellDef ngb-header-cell>
                <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
              </th>
              <td *ngbCellDef="let printer" ngb-cell>
                <app-action-dropdown>
                  <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../' + printer.id">
                    <bi name="pencil-square" />
                    {{ 'EDIT' | transloco }}
                  </a>
                  <button
                    type="button"
                    class="d-flex gap-2 align-items-center text-danger-emphasis"
                    ngbDropdownItem
                    (click)="delete.onDelete(printer.id)"
                  >
                    <bi name="trash" />
                    {{ 'DELETE' | transloco }}
                  </button>
                </app-action-dropdown>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="selection.columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let printer; columns: selection.columnsToDisplay()" ngb-row [routerLink]="'../' + printer.id"></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="table.isLoading()" />
    </div>
  `,
  selector: 'app-event-by-id-printers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
  ],
})
export class PrintersComponent {
  #modal = inject(NgbModal);
  #printersService = inject(PrintersService);
  #lumber = loggerOf('PrintersComponent');

  sort = viewChild(NgbSort);
  filter = injectTableFilter();
  table = injectTable({
    columnsToDisplay: ['name', 'font', 'fontScale', 'bonWidth', 'bonPadding', 'bonPaddingTop', 'actions'],
    fetchData: () => this.#printersService.getAll$(),
    sort: this.sort,
    filterValue$: this.filter.value$,
  });

  selection = injectTableSelect({
    dataSource: this.table.dataSource,
    columnsToDisplay: this.table.columnsToDisplay,
  });

  delete = injectTableDelete({
    delete$: (id) => this.#printersService.delete$(id),
    selection: this.selection.selection,
    nameMap: mapName(),
  });

  onBatchUpdatePrinters(): void {
    this.#lumber.info('onBatchUpdatePrinters', 'Opening settings question dialog');
    this.#lumber.info('onBatchUpdatePrinters', 'Selected entities:', this.selection.selection().selected);
    const modalRef = this.#modal.open(PrintersBatchUpdateModal, {ariaLabelledBy: 'modal-printer-batch-update-title', size: 'lg'});

    void modalRef.result
      .then((result?: PrinterBatchUpdateDto) => {
        this.#lumber.info('onBatchUpdatePrinters', 'Question dialog result:', result);
        if (result) {
          forkJoin(
            this.selection.selection().selected.map((it) =>
              this.#printersService.update$({
                id: it.id,
                name: it.name,
                fontScale: result.fontScale,
                font: result.font,
                bonWidth: result.bonWidth,
                bonPadding: result.bonPadding,
                bonPaddingTop: result.bonPaddingTop === undefined ? it.bonPaddingTop : result.bonPaddingTop ?? undefined,
              }),
            ),
          ).subscribe(() => {
            this.#printersService.triggerGet$.next(true);
          });
        }
      })
      .catch();
  }
}

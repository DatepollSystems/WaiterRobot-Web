import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '@home-shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {NgbDropdownItem, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetPrinterResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

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
          <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | transloco }}
          </button>
        </div>

        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PRINTER_SELECT' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-secondary" [class.disabled]="!selection.hasValue()" (click)="onBatchUpdatePrinters()">
            <bi name="pencil-square" />
            {{ 'HOME_PRINTER_BATCH_UPDATE' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

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
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.hasValue() && isAllSelected()"
                  (change)="$event ? toggleAllRows() : null"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
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
                  (click)="onDelete(printer.id, $event)"
                >
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </app-action-dropdown>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let printer; columns: columnsToDisplay" ngb-row [routerLink]="'../' + printer.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  selector: 'app-event-by-id-printers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
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
  ],
})
export class PrintersComponent extends AbstractModelsWithNameListWithDeleteComponent<GetPrinterResponse> {
  private modal = inject(NgbModal);

  constructor(private printersService: PrintersService) {
    super(printersService);

    this.columnsToDisplay = ['name', 'font', 'fontScale', 'bonWidth', 'bonPadding', 'bonPaddingTop', 'actions'];
  }

  onBatchUpdatePrinters(): void {
    this.lumber.info('onBatchUpdatePrinters', 'Opening settings question dialog');
    this.lumber.info('onBatchUpdatePrinters', 'Selected entities:', this.selection.selected);
    const modalRef = this.modal.open(PrintersBatchUpdateModal, {ariaLabelledBy: 'modal-printer-batch-update-title', size: 'lg'});

    void modalRef.result
      .then((result?: PrinterBatchUpdateDto) => {
        this.lumber.info('onBatchUpdatePrinters', 'Question dialog result:', result);
        if (result) {
          forkJoin(
            this.selection.selected.map((it) =>
              this.printersService.update$({
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
            this.printersService.triggerGet$.next(true);
          });
        }
      })
      .catch();
  }
}

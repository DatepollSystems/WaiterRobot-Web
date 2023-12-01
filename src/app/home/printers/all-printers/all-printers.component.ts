import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {forkJoin} from 'rxjs';

import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {AppProgressBarComponent} from '../../../_shared/ui/loading/app-progress-bar.component';
import {GetPrinterResponse} from '../../../_shared/waiterrobot-backend';
import {ScrollableToolbarComponent} from '../../_shared/components/scrollable-toolbar.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/list/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {PrintersService} from '../_services/printers.service';
import {PrinterBatchUpdateDto, PrinterBatchUpdateModalComponent} from './printer-batch-update-modal.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_PRINTERS' | tr }}</h1>

      <scrollable-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-success">
            <bi name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PRINTER_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_PRINTER_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-secondary" [class.disabled]="!selection.hasValue()" (click)="onBatchUpdatePrinters()">
            <bi name="pencil-square" />
            {{ 'HOME_PRINTER_BATCH_UPDATE' | tr }}
          </button>
        </div>
      </scrollable-toolbar>

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
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  (change)="$event ? selection.toggle(selectable) : null"
                  [checked]="selection.isSelected(selectable)"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="fontScale">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_FONT_SCALE' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.fontScale }}</td>
          </ng-container>

          <ng-container ngbColumnDef="font">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_FONT' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.font.description }}</td>
          </ng-container>

          <ng-container ngbColumnDef="bonWidth">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_WIDTH' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonWidth }}</td>
          </ng-container>

          <ng-container ngbColumnDef="bonPadding">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPadding }}</td>
          </ng-container>

          <ng-container ngbColumnDef="bonPaddingTop">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPaddingTop }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let printer" ngb-cell>
              <a
                class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                routerLink="../{{ printer.id }}"
                ngbTooltip="{{ 'EDIT' | tr }}"
              >
                <bi name="pencil-square" />
              </a>

              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
                (click)="onDelete(printer.id, $event)"
              >
                <bi name="trash" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let printer; columns: columnsToDisplay" ngb-row routerLink="../{{ printer.id }}"></tr>
        </table>
      </div>

      <app-progress-bar [hidden]="!isLoading()" />
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
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
  ],
})
export class AllPrintersComponent extends AbstractModelsWithNameListWithDeleteComponent<GetPrinterResponse> {
  private modal = inject(NgbModal);

  constructor(private printersService: PrintersService) {
    super(printersService);

    this.columnsToDisplay = ['name', 'font', 'fontScale', 'bonWidth', 'bonPadding', 'bonPaddingTop', 'actions'];
  }

  onBatchUpdatePrinters(): void {
    this.lumber.info('onBatchUpdatePrinters', 'Opening settings question dialog');
    this.lumber.info('onBatchUpdatePrinters', 'Selected entities:', this.selection.selected);
    const modalRef = this.modal.open(PrinterBatchUpdateModalComponent, {ariaLabelledBy: 'modal-printer-batch-update-title', size: 'lg'});

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
      .catch(() => {});
  }
}

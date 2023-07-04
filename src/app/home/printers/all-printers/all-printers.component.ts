import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {forkJoin, Observable} from 'rxjs';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetPrinterResponse} from '../../../_shared/waiterrobot-backend';
import {PrintersService} from '../_services/printers.service';
import {PrinterBatchUpdateDto, PrinterBatchUpdateModalComponent} from './printer-batch-update-modal.component';

@Component({
  template: `
    <h1>{{ 'NAV_PRINTERS' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary" [class.disabled]="!selection.hasValue()" (click)="onBatchUpdatePrinters()">
          <i-bs name="stack" />
          {{ 'HOME_PRINTER_BATCH_UPDATE' | tr }}
        </button>
      </div>

      <div>
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash" />
          {{ 'DELETE' | tr }}
        </button>
      </div>
    </btn-toolbar>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
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
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
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
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_BON_WIDTH' | tr }}</th>
          <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonWidth }}</td>
        </ng-container>

        <ng-container ngbColumnDef="bonPadding">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_PRINTER_BON_PADDING' | tr }}</th>
          <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPadding }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let printer" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ printer.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(printer.id, $event)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let printer; columns: columnsToDisplay" ngb-row routerLink="../{{ printer.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-event-by-id-printers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    RouterLink,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
  ],
})
export class AllPrintersComponent extends AbstractModelsWithNameListWithDeleteComponent<GetPrinterResponse> {
  constructor(private printersService: PrintersService) {
    super(printersService);

    this.columnsToDisplay = ['name', 'font', 'fontScale', 'bonWidth', 'bonPadding', 'actions'];
  }

  onBatchUpdatePrinters() {
    this.lumber.info('onBatchUpdatePrinters', 'Opening settings question dialog');
    this.lumber.info('onBatchUpdatePrinters', 'Selected entities:', this.selection.selected);
    const modalRef = this.modal.open(PrinterBatchUpdateModalComponent, {ariaLabelledBy: 'modal-printer-batch-update-title', size: 'lg'});

    void modalRef.result
      .then((result?: PrinterBatchUpdateDto) => {
        this.lumber.info('onBatchUpdatePrinters', 'Question dialog result:', result);
        if (result) {
          const observables: Observable<unknown>[] = [];
          for (const printer of this.selection.selected) {
            observables.push(
              this.printersService.update$({
                id: printer.id,
                name: printer.name,
                fontScale: result.fontScale,
                font: result.font,
                bonWidth: result.bonWidth,
                bonPadding: result.bonPadding,
              })
            );
          }
          forkJoin(observables).subscribe(() => {
            this.printersService.triggerGet$.next(true);
          });
        }
      })
      .catch(() => {});
  }
}
import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTableSelect} from '@home-shared/list';
import {injectPagination} from '@home-shared/services/pagination';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {s_imploder} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator} from 'dfx-bootstrap-table';
import {derivedFrom} from 'ngxtension/derived-from';
import {concat, debounceTime, map, pipe, switchMap, tap} from 'rxjs';
import {PrintersService} from '../printers/_services/printers.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PRINTER_SELECT' | transloco) : undefined">
          <button type="button" class="btn btn-sm btn-primary" [class.disabled]="!selection.hasValue()" (mousedown)="undelete()">
            <bi name="arrow-counterclockwise" />
            {{ 'RECOVER' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      @if (dataSource(); as dataSource) {
        <div class="table-responsive">
          <table ngb-table [hover]="true" [dataSource]="dataSource">
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell style="width: 20px">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="checked"
                    [checked]="selection.isAllSelected()"
                    (change)="selection.toggleAll()"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell>
                <div [class.ps-3]="selectable.type === 'ITEM'">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="checked"
                      [checked]="selection.isSelected(selectable)"
                      (change)="selection.toggle(selectable, !selection.isSelected(selectable))"
                    />
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>
                {{ printer.name }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="fontScale">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PRINTER_FONT_SCALE' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.fontScale }}</td>
            </ng-container>

            <ng-container ngbColumnDef="font">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PRINTER_FONT' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.font.description }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonWidth">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PRINTER_BON_WIDTH' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonWidth }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonPadding">
              <th *ngbHeaderCellDef ngb-header-cell class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPadding }}</td>
            </ng-container>

            <ng-container ngbColumnDef="bonPaddingTop">
              <th *ngbHeaderCellDef ngb-header-cell class="ws-nowrap">{{ 'HOME_PRINTER_BON_PADDING_TOP' | transloco }}</th>
              <td *ngbCellDef="let printer" ngb-cell>{{ printer.bonPaddingTop }}</td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let printer; columns: columnsToDisplay()" ngb-row></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="pagination.loading()" />

      @if (!pagination.loading() && dataSource().length < 1) {
        <div class="w-100 text-center mt-2">{{ 'RECYCLE_BIN_EMPTY' | transloco }}</div>
      }

      <ngb-paginator
        showFirstLastButtons
        [length]="pagination.totalElements()"
        [pageSize]="pagination.params().size"
        [pageSizeOptions]="[5, 10, 20]"
        [pageIndex]="pagination.params().page"
      />
    </div>
  `,
  selector: 'app-printers-recycle-bin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    DfxTableModule,
    NgbTooltip,
    DfxPaginationModule,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    DfxSortModule,
  ],
})
export class PrintersRecycleBinComponent {
  #confirmDialog = injectConfirmDialog();
  #printersService = inject(PrintersService);

  columnsToDisplay = signal(['name', 'font', 'fontScale', 'bonWidth', 'bonPadding', 'bonPaddingTop']);
  private paginator = viewChild.required(NgbPaginator);

  pagination = injectPagination({
    defaultSortBy: 'createdAt',
    paginator: this.paginator,
    defaultPageSize: 5,
  });

  dataSource = derivedFrom(
    [this.pagination.params],
    pipe(
      debounceTime(350),
      tap(() => {
        this.pagination.loading.set(true);
      }),
      switchMap(([options]) => this.#printersService.getAllDeleted$(options)),
      map((it) => {
        this.pagination.loading.set(false);
        this.pagination.totalElements.set(it.numberOfItems);
        return it.data;
      }),
    ),
    {initialValue: []},
  );

  selection = injectTableSelect({
    dataSource: this.dataSource,
    columnsToDisplay: this.columnsToDisplay,
  });

  undelete(): void {
    const selected = this.selection
      .selection()
      .selected.sort((a, b) => a.name.localeCompare(b.name))
      .filter((it) => !!it.deleted);
    void this.#confirmDialog(
      'RECOVER_ALL',
      `<ol><li>${s_imploder()
        .mappedSource(selected, (it) => it.name)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        concat(...selected.map((it) => this.#printersService.unDelete$(it.id))).subscribe({
          complete: () => {
            this.#printersService.triggerGet$.next(true);
            this.selection.clear();
          },
        });
      }
    });
  }
}

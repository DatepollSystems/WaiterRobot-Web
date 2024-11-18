import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';

import {concat, debounceTime, map, pipe, switchMap, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxTableModule, NgbPaginator} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe, StopPropagationDirective} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';

import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTableSelect} from '@home-shared/list';
import {AppActivatedPipe} from '@home-shared/pipes/app-activated.pipe';

import {injectPagination} from '@shared/api/pagination';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {OrganisationWaitersService} from '../waiters/_services/organisation-waiters.service';
import {WaitersService} from '../waiters/_services/waiters.service';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_WAITERS_SELECT_INFO' | transloco) : undefined">
          <button class="btn btn-sm btn-primary" [class.disabled]="!selection.hasValue()" (mousedown)="undelete()" type="button">
            <bi name="arrow-counterclockwise" />
            {{ 'RECOVER' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      @if (dataSource(); as dataSource) {
        <div class="table-responsive">
          <table [hover]="true" [dataSource]="dataSource" ngb-table>
            <ng-container ngbColumnDef="select">
              <th *ngbHeaderCellDef ngb-header-cell style="width: 20px">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    [checked]="selection.isAllSelected()"
                    (click)="selection.toggleAll()"
                    stopPropagation
                    type="checkbox"
                    name="checked"
                  />
                </div>
              </th>
              <td *ngbCellDef="let selectable" ngb-cell>
                <div [class.ps-3]="selectable.type === 'ITEM'">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      [checked]="selection.isSelected(selectable)"
                      (click)="selection.toggle(selectable, !selection.isSelected(selectable))"
                      stopPropagation
                      type="checkbox"
                      name="checked"
                    />
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'NAME' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.name }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="activated">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'HOME_USERS_ACTIVATED' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.activated | activated }}
              </td>
            </ng-container>

            <ng-container ngbColumnDef="events">
              <th *ngbHeaderCellDef ngb-header-cell>
                {{ 'NAV_EVENTS' | transloco }}
              </th>
              <td *ngbCellDef="let waiter" ngb-cell>
                {{ waiter.events | a_mapName | s_implode: ', ' : 30 : '...' }}
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let binItem; columns: columnsToDisplay()"
              (click)="selection.toggle(binItem, !selection.isSelected(binItem))"
              ngb-row
            ></tr>
          </table>
        </div>
      }

      <app-progress-bar [show]="pagination.loading()" />

      @if (!pagination.loading() && dataSource().length < 1) {
        <div class="w-100 text-center mt-2">
          {{ 'RECYCLE_BIN_EMPTY' | transloco }}
        </div>
      }

      <ngb-paginator
        [length]="pagination.totalElements()"
        [pageSize]="pagination.params().size"
        [pageSizeOptions]="[5, 10, 20]"
        [pageIndex]="pagination.params().page"
        showFirstLastButtons
      />
    </div>
  `,
  selector: 'app-waiters-recycle-bin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    DfxTableModule,
    DfxPaginationModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    NgbTooltip,
    BiComponent,
    ScrollableToolbarComponent,
    AppProgressBarComponent,
    AppActivatedPipe,
    StopPropagationDirective,
  ],
})
export class WaitersRecycleBinComponent {
  #confirmDialog = injectConfirmDialog();
  #waitersService = inject(WaitersService);
  #organisationWaitersService = inject(OrganisationWaitersService);

  columnsToDisplay = signal(['name', 'activated', 'events']);
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
      switchMap(([options]) => this.#organisationWaitersService.getAllDeleted$(options)),
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
        .source(selected, (it) => it.name)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        concat(...selected.map((it) => this.#organisationWaitersService.unDelete$(it.id))).subscribe({
          complete: () => {
            this.#waitersService.triggerGet$.next(true);
            this.selection.clear();
          },
        });
      }
    });
  }
}

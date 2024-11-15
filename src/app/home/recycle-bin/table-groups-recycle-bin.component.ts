import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';

import {EMPTY, catchError, concat, debounceTime, map, of, pipe, switchMap, tap} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxTableModule, NgbPaginator} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTableSelect} from '@home-shared/list';

import {BackendType} from '@shared/api';
import {injectPagination} from '@shared/api/pagination';
import {NotificationService} from '@shared/notifications/notification.service';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {TableGroupsService} from '../tables/_services/table-groups.service';
import {TablesService} from '../tables/_services/tables.service';
import {GenericGroupBinType, sortBinTypes} from './utils';

type BinType = (BackendType['GetTableMinResponse'] | BackendType['GetTableGroupResponse']) & GenericGroupBinType;

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_TABLE_SELECT_REQUIRED' | transloco) : undefined">
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
                      (click)="toggle(selectable, !selection.isSelected(selectable))"
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
              <td *ngbCellDef="let binItem" ngb-cell>
                <div [class.ps-3]="binItem.type === 'ITEM'">
                  <app-text-with-color-indicator [color]="binItem.color">
                    {{ binItem.name }}
                  </app-text-with-color-indicator>
                </div>
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay()" ngb-header-row></tr>
            <tr
              *ngbRowDef="let binItem; columns: columnsToDisplay()"
              (click)="toggle(binItem, !selection.isSelected(binItem))"
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
  selector: 'app-table-groups-recycle-bin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    DfxTableModule,
    DfxPaginationModule,
    NgbTooltip,
    BiComponent,
    ScrollableToolbarComponent,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
    StopPropagationDirective,
  ],
})
export class TableGroupsRecycleBinComponent {
  #confirmDialog = injectConfirmDialog();
  #notificationService = inject(NotificationService);
  #tableGroupsService = inject(TableGroupsService);
  #tableService = inject(TablesService);

  columnsToDisplay = signal(['name']);
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
      switchMap(([options]) => this.#tableGroupsService.getAllDeleted$(options)),
      map((it) => {
        this.pagination.loading.set(false);
        this.pagination.totalElements.set(it.numberOfItems);
        return it.data
          .map((tableGroup) => ({
            ...tableGroup,
            tables: tableGroup.tables.map((table) => ({
              ...table,
              name: `${table.number}`,
              groupId: tableGroup.id,
              groupName: tableGroup.name,
              type: 'ITEM' as const,
            })),
            groupId: undefined,
            groupName: undefined,
            type: 'GROUP' as const,
          }))
          .reduce<BinType[]>((previous, current) => {
            return [...previous, current, ...current.tables];
          }, []);
      }),
    ),
    {initialValue: []},
  );

  selection = injectTableSelect({
    dataSource: this.dataSource,
    columnsToDisplay: this.columnsToDisplay,
    getSelectionModel: (it) => new SelectionModel(true, it, false, (o1, o2) => o1.id === o2.id && o1.type === o2.type),
  });

  undelete(): void {
    const selected = this.selection
      .selection()
      .selected.sort(sortBinTypes)
      .filter((it) => !!it.deleted);
    void this.#confirmDialog(
      'RECOVER_ALL',
      `<ol><li>${s_imploder()
        .mappedSource(selected, (it) => `${it.type === 'ITEM' ? `(${it.groupName}) ` : ''}${it.name}`)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        concat(
          ...selected.map((it) => {
            if (it.type === 'ITEM') {
              return this.#tableService.unDelete$(it.id).pipe(
                catchError((error) => {
                  if (error?.status === 409) {
                    this.#notificationService.twarning('HOME_TABLES_NUMBER_EXISTS_ALREADY');
                  }

                  return of(EMPTY);
                }),
              );
            } else if (it.type === 'GROUP') {
              return this.#tableGroupsService.unDelete$(it.id);
            } else {
              throw 'Unknown bin type';
            }
          }),
        ).subscribe({
          complete: () => {
            this.#tableService.triggerGet$.next(true);
            this.#tableGroupsService.triggerGet$.next(true);
            this.selection.clear();
          },
        });
      }
    });
  }

  toggle(it: BinType, isSelected: boolean): void {
    if (it.type === 'GROUP') {
      // Toggle the parent group
      this.selection.toggle(it, isSelected);

      // Find all child items belonging to this group and toggle them
      const childItems = this.dataSource().filter((item) => item.groupId === it.id && item.type === 'ITEM');
      childItems.forEach((item) => {
        this.selection.toggle(item, isSelected);
      });
    } else if (it.type === 'ITEM') {
      // Toggle the individual item
      this.selection.toggle(it, isSelected);

      // Check if the parent group is selected, if not, select the parent group
      const parentGroup = this.dataSource().find((group) => group.id === it.groupId && group.type === 'GROUP');
      if (parentGroup && !this.selection.isSelected(parentGroup)) {
        this.selection.toggle(parentGroup, isSelected);
      }
    } else {
      throw 'Unknown bin type';
    }
  }
}

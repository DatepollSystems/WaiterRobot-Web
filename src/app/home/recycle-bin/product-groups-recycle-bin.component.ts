import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {injectTableSelect} from '@home-shared/list';
import {AppSoldOutPipe} from '@home-shared/pipes/app-sold-out.pipe';
import {injectPagination} from '@home-shared/services/pagination';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetProductGroupMaxResponse, GetProductResponse} from '@shared/waiterrobot-backend';
import {s_imploder} from 'dfts-helper';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxTableModule, NgbPaginator} from 'dfx-bootstrap-table';
import {DfxCurrencyCentPipe} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';
import {concat, debounceTime, map, pipe, switchMap, tap} from 'rxjs';
import {ProductGroupsService} from '../products/_services/product-groups.service';
import {ProductsService} from '../products/_services/products.service';

type BinType = (GetProductResponse | GetProductGroupMaxResponse) & {type: 'ITEM' | 'GROUP'; groupId?: number; groupName?: string};

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div [ngbTooltip]="!selection.hasValue() ? ('HOME_PROD_SELECT_INFO' | transloco) : undefined">
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
                      (change)="toggle(selectable, !selection.isSelected(selectable))"
                    />
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="name">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'NAME' | transloco }}</th>
              <td *ngbCellDef="let binItem" ngb-cell>
                <div [class.ps-3]="binItem.type === 'ITEM'">
                  <app-text-with-color-indicator [color]="binItem.color">
                    {{ binItem.name }}
                  </app-text-with-color-indicator>
                </div>
              </td>
            </ng-container>

            <ng-container ngbColumnDef="price">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'PRICE' | transloco }}</th>
              <td *ngbCellDef="let binItem" ngb-cell>
                @if (binItem.price) {
                  {{ binItem.price | currency }}
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="soldOut">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_AVAILABLE' | transloco }}</th>
              <td *ngbCellDef="let binItem" ngb-cell>
                @if (binItem.soldOut !== undefined) {
                  {{ binItem.soldOut | soldOut }}
                }
              </td>
            </ng-container>

            <ng-container ngbColumnDef="initialStock">
              <th *ngbHeaderCellDef ngb-header-cell>{{ 'HOME_PROD_AMOUNT_LEFT' | transloco }}</th>
              <td *ngbCellDef="let binItem" ngb-cell>
                @if (binItem.initialStock) {
                  <span>
                    {{ binItem.initialStock - binItem.amountOrdered }}
                  </span>
                }
              </td>
            </ng-container>

            <tr *ngbHeaderRowDef="columnsToDisplay()" ngb-header-row></tr>
            <tr *ngbRowDef="let binItem; columns: columnsToDisplay()" ngb-row></tr>
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
  selector: 'app-product-groups-recycle-bin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    DfxTableModule,
    NgbTooltip,
    DfxPaginationModule,
    DfxCurrencyCentPipe,
    BiComponent,
    ScrollableToolbarComponent,
    AppTextWithColorIndicatorComponent,
    AppProgressBarComponent,
    AppSoldOutPipe,
  ],
})
export class ProductGroupsRecycleBinComponent {
  #confirmDialog = injectConfirmDialog();
  #productGroupsService = inject(ProductGroupsService);
  #productService = inject(ProductsService);

  columnsToDisplay = signal(['name', 'price', 'soldOut', 'initialStock']);
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
      switchMap(([options]) => this.#productGroupsService.getAllDeleted$(options)),
      map((it) => {
        this.pagination.loading.set(false);
        this.pagination.totalElements.set(it.numberOfItems);
        return it.data
          .map((productGroup) => ({
            ...productGroup,
            products: productGroup.products.map((product) => ({
              ...product,
              groupId: productGroup.id,
              groupName: productGroup.name,
              type: 'ITEM' as const,
            })),
            groupId: undefined,
            groupName: undefined,
            type: 'GROUP' as const,
          }))
          .reduce<BinType[]>((previous, current) => {
            return [...previous, current, ...current.products];
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
              return this.#productService.unDelete$(it.id);
            } else if (it.type === 'GROUP') {
              return this.#productGroupsService.unDelete$(it.id);
            } else {
              throw 'Unknown bin type';
            }
          }),
        ).subscribe({
          complete: () => {
            this.#productService.triggerGet$.next(true);
            this.#productGroupsService.triggerGet$.next(true);
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

function sortBinTypes(a: BinType, b: BinType): number {
  // Compare groups and items by type first
  if (a.type !== b.type) {
    return a.type === 'GROUP' ? -1 : 1; // Groups come before items
  }

  // If both are groups or both are items, sort by name
  const nameComparison = a.name.localeCompare(b.name);
  if (nameComparison !== 0) {
    return nameComparison;
  }

  // If names are the same and both are items, sort by groupId
  if (a.type === 'ITEM' && b.type === 'ITEM') {
    return (a.groupId ?? 0) - (b.groupId ?? 0);
  }

  return 0;
}

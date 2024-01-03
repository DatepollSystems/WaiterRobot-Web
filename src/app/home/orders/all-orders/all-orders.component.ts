import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {debounceTime, forkJoin, map, merge, Observable, pipe, startWith, switchMap, tap} from 'rxjs';

import {AppTestBadge} from '@home-shared/components/app-test-badge.component';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {Download} from '@home-shared/services/download.service';
import {getSortParam, injectPagination} from '@home-shared/services/pagination';
import {NgbCollapse, NgbProgressbar, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {injectCustomFormBuilder, injectIsValid} from '@shared/form';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetOrderMinResponse, GetTableWithGroupResponse} from '@shared/waiterrobot-backend';
import {computedFrom} from 'ngxtension/computed-from';

import {loggerOf, n_from, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {injectIsMobile} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {ProductsService} from '../../products/_services/products.service';
import {TableGroupsService} from '../../tables/_services/table-groups.service';
import {TablesService} from '../../tables/_services/tables.service';
import {OrganisationWaitersService} from '../../waiters/_services/organisation-waiters.service';
import {AppOrderRefreshButtonComponent} from '../_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from '../_components/app-order-state-badge.component';
import {OrdersService} from '../orders.service';

@Component({
  templateUrl: 'all-orders.component.html',
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgbCollapse,
    NgbProgressbar,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    BiComponent,
    NgSelectModule,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    ScrollableToolbarComponent,
    AppTestBadge,
    AppProgressBarComponent,
  ],
})
export class AllOrdersComponent implements AfterViewInit {
  private confirmDialog = injectConfirmDialog();
  private ordersService = inject(OrdersService);

  pagination = injectPagination('createdAt', 'desc');

  route = inject(ActivatedRoute);
  router = inject(Router);

  isMobile = injectIsMobile();

  lumber = loggerOf('AllOrders');

  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;

  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  download$?: Observable<Download>;

  filterForm = injectCustomFormBuilder().group({
    tableId: [undefined as unknown as number],
    tableGroupId: [undefined as unknown as number],
    waiterId: [undefined as unknown as number],
    productIds: [new Array<number>()],
  });
  filterFormValueChanges = this.filterForm.valueChanges.pipe(
    startWith({tableId: undefined, waiterId: undefined, tableGroupId: undefined, productIds: undefined}),
  );

  isFilterValid = injectIsValid(this.filterForm);

  fieldNames: (keyof typeof this.filterForm.controls)[] = Object.keys(
    this.filterForm.controls,
  ) as (keyof typeof this.filterForm.controls)[];
  filterCount = computedFrom(
    [this.filterFormValueChanges],
    map(([form]) =>
      this.fieldNames.reduce(
        (count, fieldName) => count + (Array.isArray(form[fieldName]) ? (form[fieldName] as []).length : form[fieldName] ? 1 : 0),
        0,
      ),
    ),
  );

  dataSource = computedFrom(
    [this.pagination.params, this.filterFormValueChanges],
    pipe(
      debounceTime(350),
      tap(() => this.pagination.loading.set(true)),
      switchMap(([options, {tableId, waiterId, tableGroupId, productIds}]) =>
        this.ordersService.getAllPaginated(
          {
            page: options.page,
            size: options.size,
            sort: getSortParam(options.sort, options.direction),
          },
          tableGroupId,
          tableId,
          waiterId,
          productIds,
        ),
      ),
      map((it) => {
        this.pagination.loading.set(false);
        this.pagination.totalElements.set(it.numberOfItems);
        return it.data;
      }),
    ),
    {initialValue: []},
  );

  tables = toSignal(inject(TablesService).getAll$(), {initialValue: []});
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {initialValue: []});
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {initialValue: []});
  products = toSignal(inject(ProductsService).getAll$(), {initialValue: []});

  constructor() {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(),
        map((params) => ({
          tableId: params.get('tableId'),
          waiterId: params.get('waiterId'),
          tableGroupId: params.get('tableGroupId'),
          productIds: params.getAll('productIds'),
        })),
      )
      .subscribe(({waiterId, tableId, tableGroupId, productIds}) => {
        if (tableId && n_from(tableId) !== this.filterForm.controls.tableId.value) {
          this.filterForm.controls.tableId.patchValue(n_from(tableId));
        }
        if (waiterId && n_from(waiterId) !== this.filterForm.controls.waiterId.value) {
          this.filterForm.controls.waiterId.patchValue(n_from(waiterId));
        }
        if (tableGroupId && n_from(tableGroupId) !== this.filterForm.controls.tableGroupId.value) {
          this.filterForm.controls.tableGroupId.patchValue(n_from(tableGroupId));
        }
        if (productIds.length > 0) {
          this.filterForm.controls.productIds.setValue(updateArrayValues(this.filterForm.controls.productIds.value, productIds));
        }
      });

    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((queryParams) => {
      this.lumber.info('filterFormValueChanges', 'Set query params', queryParams);
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams,
      });
    });
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
      const params = {
        size: this.paginator.pageSize,
        page: this.paginator.pageIndex,
        sort: this.sort.active,
        direction: this.sort.direction,
      };
      this.lumber.log('updatePaginationParams', 'new params', params);
      this.pagination.updateParams(params);
    });
  }

  customTableSearch(term: string, item: GetTableWithGroupResponse): boolean {
    term = term.toLowerCase().trim().replace(/\s/g, '');
    const groupName = item.group.name.toLowerCase().trim().replace(/\s/g, '');
    const tableNumber = item.number.toString();
    return groupName.indexOf(term) > -1 || tableNumber.indexOf(term) > -1 || `${groupName}-${tableNumber}`.indexOf(term) > -1;
  }

  exportCsv(): void {
    this.download$ = this.ordersService.download$();
  }

  printAllTest(): void {
    void this.confirmDialog('Testbestellung aufgeben?').then((result) => {
      if (result) {
        this.ordersService.printAllTest();
      }
    });
  }

  requeueOrder(it: GetOrderMinResponse): void {
    this.selection.clear();
    this.selection.toggle(it);
    this.requeueOrders();
  }

  requeueOrders(): void {
    this.lumber.info('requeueOrders', 'Opening requeue question dialog');
    this.lumber.info('requeueOrders', 'Selected entities:', this.selection.selected);
    const selected = this.selection.selected.slice();
    void this.confirmDialog(
      'HOME_ORDER_REQUEUE',
      `<ol><li>${s_imploder()
        .mappedSource(selected, (it) => it.orderNumber)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        const observables: Observable<unknown>[] = [];
        for (const it of selected) {
          observables.push(this.ordersService.requeueOrder$(it.id));
        }
        forkJoin(observables).subscribe();
      }
    });
  }
}

function updateArrayValues(originalArray: number[], newArray: string[]): number[] {
  const mappedNewArray = newArray.map(n_from);
  const toAdd: number[] = [];
  const toRemove: number[] = [];

  for (const item of mappedNewArray) {
    if (!originalArray.includes(item)) {
      toAdd.push(item);
    }
  }

  for (const item of originalArray) {
    if (!mappedNewArray.includes(item)) {
      toRemove.push(item);
    }
  }

  return [...originalArray.filter((item) => !toRemove.includes(item)), ...toAdd];
}

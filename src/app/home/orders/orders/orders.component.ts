import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {AppTestBadge} from '@home-shared/components/app-test-badge.component';
import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {Download} from '@home-shared/services/download.service';
import {injectFilter} from '@home-shared/services/filter';
import {injectPagination} from '@home-shared/services/pagination';
import {NgbCollapse, NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslocoPipe} from '@jsverse/transloco';
import {injectCustomFormBuilder} from '@shared/form';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetOrderMinResponse, GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {loggerOf, s_imploder} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule, NgbPaginator, NgbSort} from 'dfx-bootstrap-table';
import {injectIsMobile, StopPropagationDirective} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';

import {debounceTime, forkJoin, map, Observable, pipe, switchMap, tap} from 'rxjs';

import {ProductGroupsService} from '../../products/_services/product-groups.service';
import {ProductsService} from '../../products/_services/products.service';
import {TableGroupsService} from '../../tables/_services/table-groups.service';
import {TablesService} from '../../tables/_services/tables.service';
import {OrganisationWaitersService} from '../../waiters/_services/organisation-waiters.service';
import {AppOrderRefreshButtonComponent} from '../_components/app-order-refresh-button.component';
import {AppOrderStateBadgeComponent} from '../_components/app-order-state-badge.component';
import {OrdersService} from '../orders.service';

@Component({
  templateUrl: './orders.component.html',
  selector: 'app-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgbCollapse,
    NgSelectModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    TranslocoPipe,
    BiComponent,
    AppOrderStateBadgeComponent,
    AppOrderRefreshButtonComponent,
    ScrollableToolbarComponent,
    AppTestBadge,
    AppProgressBarComponent,
    ActionDropdownComponent,
    NgbDropdownItem,
    StopPropagationDirective,
  ],
})
export class OrdersComponent {
  #confirmDialog = injectConfirmDialog();
  #ordersService = inject(OrdersService);

  isMobile = injectIsMobile();

  lumber = loggerOf('AllOrders');

  private paginator = viewChild.required(NgbPaginator);
  private sort = viewChild.required(NgbSort);

  pagination = injectPagination({
    defaultSortBy: 'createdAt',
    paginator: this.paginator,
    sort: this.sort,
  });

  columnsToDisplay = ['select', 'orderNumber', 'state', 'table.tableGroup.name', 'waiter.name', 'createdAt', 'actions'];
  selection = new SelectionModel<GetOrderMinResponse>(true, [], false, (a, b) => a.id === b.id);

  filter = injectFilter(
    injectCustomFormBuilder().group({
      tableIds: [new Array<number>()],
      tableGroupIds: [new Array<number>()],
      productIds: [new Array<number>()],
      productGroupIds: [new Array<number>()],
      waiterIds: [new Array<number>()],
    }),
  );

  dataSource = derivedFrom(
    [this.pagination.params, this.filter.valueChanges],
    pipe(
      debounceTime(350),
      tap(() => {
        this.pagination.loading.set(true);
      }),
      switchMap(([options, filter]) =>
        this.#ordersService.getAllPaginated(
          options,
          filter?.tableIds,
          filter?.tableGroupIds,
          filter?.productIds,
          filter?.productGroupIds,
          filter?.waiterIds,
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

  download$?: Observable<Download>;

  tables = toSignal(inject(TablesService).getAllWithoutExtra$(), {initialValue: []});
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {initialValue: []});
  products = toSignal(inject(ProductsService).getAll$(), {initialValue: []});
  productGroups = toSignal(inject(ProductGroupsService).getAll$(), {initialValue: []});
  waiters = toSignal(inject(OrganisationWaitersService).getAll$(), {initialValue: []});

  constructor() {
    this.#ordersService.triggerRefresh.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pagination.loading.set(true);
    });
  }

  customTableSearch(term: string, item: GetTableWithGroupResponse): boolean {
    term = term.toLowerCase().trim().replace(/\s/g, '');
    const groupName = item.group.name.toLowerCase().trim().replace(/\s/g, '');
    const tableNumber = item.number.toString();
    return groupName.includes(term) || tableNumber.includes(term) || `${groupName}-${tableNumber}`.includes(term);
  }

  exportCsv(): void {
    this.download$ = this.#ordersService.download$();
  }

  printAllTest(): void {
    void this.#confirmDialog('Testbestellung aufgeben?').then((result) => {
      if (result) {
        this.#ordersService.printAllTest();
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
    void this.#confirmDialog(
      'HOME_ORDER_REQUEUE',
      `<ol><li>${s_imploder()
        .mappedSource(selected, (it) => it.orderNumber)
        .separator('</li><li>')
        .build()}</li></ol>`,
    ).then((result) => {
      if (result) {
        const observables: Observable<unknown>[] = [];
        for (const it of selected) {
          observables.push(this.#ordersService.requeueOrder$(it.id));
        }
        forkJoin(observables).subscribe();
      }
    });
  }
}

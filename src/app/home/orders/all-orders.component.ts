import {SelectionModel} from '@angular/cdk/collections';
import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {b_fromStorage, s_imploder, st_set} from 'dfts-helper';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {distinctUntilChanged, forkJoin, Observable, tap} from 'rxjs';
import {AbstractModelsListComponent} from '../../_shared/ui/abstract-models-list.component';
import {AppBackButtonComponent} from '../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {injectConfirmDialog} from '../../_shared/ui/question-dialog/question-dialog.component';
import {GetOrderResponse} from '../../_shared/waiterrobot-backend';
import {AppOrderCountdownComponent} from './_components/app-order-countdown.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-between">
      <h1>{{ 'HOME_ORDERS_ALL' | tr }}</h1>
      <app-order-countdown [countdown]="(countdown$ | async) ?? 0" />
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-warning" (click)="requeueOrders()" [class.disabled]="!selection.hasValue()">
            <i-bs name="printer" />
            {{ 'HOME_ORDER_REQUEUE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <ng-container *ngIf="openInNewTabChanges$ | async" />
      <div class="form-check form-switch form-check-reverse">
        <label class="form-check-label" for="continuousCreation">In neuen Tab öffnen</label>
        <input [formControl]="openInNewTab" class="form-check-input" type="checkbox" role="switch" id="continuousCreation" />
      </div>
    </div>

    <form class="mt-2">
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

    <ng-container *ngSub="dataSource$ as dataSource">
      <div class="table-responsive">
        <table
          ngb-table
          [hover]="true"
          [dataSource]="dataSource"
          ngb-sort
          ngbSortActive="createdAt"
          ngbSortDirection="desc"
          [trackBy]="trackBy"
        >
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell></th>
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

          <ng-container ngbColumnDef="orderNumber">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_NUMBER' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.orderNumber }}</td>
          </ng-container>

          <ng-container ngbColumnDef="table">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_TABLE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">{{
                order.table.group.name
              }}</a>
              - <a (click)="$event.stopPropagation()" routerLink="/home/tables/{{ order.table.id }}">{{ order.table.number }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="waiter">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <a (click)="$event.stopPropagation()" routerLink="/home/waiters/{{ order.waiter.id }}">{{ order.waiter.name }}</a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="state">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STATE' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <app-order-state-badge
                [orderState]="order.state"
                [orderProductStates]="order.orderProductStates"
                [createdAt]="order.createdAt"
                [processedAt]="order.processedAt"
              />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="createdAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORDER_CREATED_AT' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>{{ order.createdAt | date: 'dd.MM. HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let order" ngb-cell>
              <button
                class="btn btn-sm m-1 btn-outline-primary text-white"
                (click)="$event.stopPropagation(); openOrder(order)"
                ngbTooltip="{{ 'OPEN' | tr }}"
                placement="left"
              >
                <i-bs name="arrow-up-right-square-fill" />
              </button>
              <button
                class="btn btn-sm m-1 btn-warning"
                (click)="$event.stopPropagation(); requeueOrder(order)"
                ngbTooltip="{{ 'HOME_ORDER_REQUEUE' | tr }}"
                placement="right"
              >
                <i-bs name="printer" />
              </button>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let order; columns: columnsToDisplay" ngb-row (click)="openOrder(order)" class="clickable"></tr>
        </table>
      </div>

      <app-spinner-row [show]="isLoading" />

      <ngb-paginator [collectionSize]="dataSource.data.length" [pageSizes]="[100, 250, 500, 1000, 2000]" [pageSize]="250" />
    </ng-container>
  `,
  selector: 'app-all-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTooltip,
    NgSub,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
    RouterLink,
    AppOrderStateBadgeComponent,
    AppOrderCountdownComponent,
    AppBackButtonComponent,
    AppBtnToolbarComponent,
  ],
})
export class AllOrdersComponent extends AbstractModelsListComponent<GetOrderResponse> {
  openInNewTab = new FormControl<boolean>(b_fromStorage('open_order_in_new_tab') ?? true);
  openInNewTabChanges$ = this.openInNewTab.valueChanges.pipe(
    distinctUntilChanged(),
    tap((it) => st_set('open_order_in_new_tab', it ?? true)),
  );

  public selection = new SelectionModel<GetOrderResponse>(true, [], false, (a, b) => a.id === b.id);
  private confirmDialog = injectConfirmDialog();

  constructor(private ordersService: OrdersService) {
    super(ordersService);

    this.columnsToDisplay = ['select', 'orderNumber', 'state', 'table', 'waiter', 'createdAt', 'actions'];

    this.sortingDataAccessors = new Map();
    this.sortingDataAccessors.set('table', (it) => it.table.number);
    this.sortingDataAccessors.set('waiter', (it) => it.waiter.name);
    this.sortingDataAccessors.set('createdAt', (it) => new Date(it.createdAt).getTime());
    this.sortingDataAccessors.set('state', (it) => {
      if (it.state === 'QUEUED') {
        return 'QUEUED';
      } else if (it.orderProducts.map((iit) => iit.printState).includes('QUEUED')) {
        return 'IN_PROGRESS';
      } else {
        return 'PROCESSED';
      }
    });
  }

  trackBy = (index: number, t: GetOrderResponse): number => t.id;
  countdown$ = this.ordersService.countdown$();

  openOrder(it: GetOrderResponse): void {
    if (this.openInNewTab.value ?? true) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/home/orders/${it.id}`]));

      window.open(url, '_blank');
      return;
    }
    void this.router.navigateByUrl(`/home/orders/${it.id}`);
  }

  requeueOrder(it: GetOrderResponse): void {
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

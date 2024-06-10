import {AsyncPipe, DatePipe, KeyValuePipe, NgClass} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {GetImplodedOrderProductResponse} from '@shared/waiterrobot-backend';

import {s_fromStorage, st_set} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';

import {BehaviorSubject, combineLatest, map} from 'rxjs';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';
import {AppOrderProductsListTableComponent} from './app-order-products-list-table.component';

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-column flex-sm-row gap-2 justify-content-between mb-4">
        <div class="d-flex align-items-center gap-2">
          <span>Gruppierung:</span>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primary" [class.active]="vm.groupedBy === 'OFF'" (mousedown)="setGroupedBy('OFF')">
              Aus
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              [class.active]="vm.groupedBy === 'PRINTER'"
              (mousedown)="setGroupedBy('PRINTER')"
            >
              Drucker
            </button>
          </div>
        </div>
      </div>

      @switch (vm.groupedBy) {
        @case ('OFF') {
          <div>
            <app-order-products-list-table [orderProducts]="_orderProducts" />
          </div>
        }

        @case ('PRINTER') {
          @if (groupedOrderProducts$ | async; as grouped) {
            <div class="mt-2 d-flex flex-column gap-3">
              @for (groups of grouped | keyvalue; track groups.value.printerId) {
                <div class="card">
                  <div class="card-header d-flex flex-wrap gap-2 justify-content-between pt-2">
                    <a [routerLink]="'../../printers/' + groups.value.printerId">
                      <h4 class="d-flex align-items-center gap-2">
                        {{ groups.value.printerName }}
                      </h4>
                    </a>
                    <div>
                      @if (showRequeueButton) {
                        <button
                          type="button"
                          class="btn btn-sm btn-warning"
                          placement="left"
                          [ngbTooltip]="'HOME_ORDER_REQUEUE' | transloco"
                          (mousedown)="requeueOrdersOfPrinter.next(groups.key)"
                        >
                          <bi name="printer" />
                        </button>
                      }
                    </div>
                  </div>
                  <div class="card-body">
                    <app-order-products-list-table hidePrintedBy [orderProducts]="groups.value.orderProducts" />
                  </div>
                </div>
              }
            </div>
          }
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    AsyncPipe,
    AppOrderProductStateBadgeComponent,
    NgClass,
    DatePipe,
    RouterLink,
    KeyValuePipe,
    AppOrderProductsListTableComponent,
    BiComponent,
    NgbTooltip,
  ],
  selector: 'app-order-products-list',
  standalone: true,
})
export class AppOrderProductsListComponent {
  @Input({required: true}) set orderProducts(it: GetImplodedOrderProductResponse[]) {
    this._orderProducts = it;
    this.orderProducts$.next(this._orderProducts);
  }
  _orderProducts!: GetImplodedOrderProductResponse[];

  @Input({transform: booleanAttribute}) showRequeueButton = false;

  @Output() readonly requeueOrdersOfPrinter = new EventEmitter<number>();

  orderProducts$ = new BehaviorSubject<GetImplodedOrderProductResponse[]>([]);

  groupedBy$ = new BehaviorSubject<orderProductGroupedByType>(
    (s_fromStorage('order_product_grouped_pref') as orderProductGroupedByType | undefined) ?? 'OFF',
  );

  setGroupedBy(it: orderProductGroupedByType): void {
    this.groupedBy$.next(it);
    st_set('order_product_grouped_pref', it);
  }

  groupedOrderProducts$ = combineLatest([this.orderProducts$, this.groupedBy$]).pipe(
    map(([orderProducts]) => {
      const groups = new Map<number, groupedType>();
      for (const orderProduct of orderProducts) {
        const group =
          groups.get(orderProduct.printedBy.id) ??
          ({
            printerId: orderProduct.printedBy.id,
            printerName: orderProduct.printedBy.name,
            orderProducts: [],
          } as groupedType);
        group.orderProducts.push(orderProduct);
        groups.set(orderProduct.printedBy.id, group);
      }
      return groups;
    }),
  );

  vm$ = combineLatest([this.groupedBy$]).pipe(map(([groupedBy]) => ({groupedBy})));
}

type orderProductGroupedByType = 'OFF' | 'PRINTER';

interface groupedType {
  printerName: string;
  printerId: number;
  orderProducts: GetImplodedOrderProductResponse[];
}

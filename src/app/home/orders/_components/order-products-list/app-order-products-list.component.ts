import {AsyncPipe, DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {s_fromStorage, st_set} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {BehaviorSubject, combineLatest, map, tap} from 'rxjs';
import {AppIconsModule} from '../../../../_shared/ui/icons.module';
import {GetOrderProductResponse} from '../../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';
import {AppOrderProductsListCardsComponent} from './app-order-products-list-cards.component';
import {AppOrderProductsListTableComponent} from './app-order-products-list-table.component';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="d-flex flex-column flex-sm-row gap-2 justify-content-between mb-4">
        <div class="btn-group">
          <button class="btn btn-sm btn-primary" (click)="setViewStyle('TABLE')" [class.active]="vm.viewStyle === 'TABLE'">Tabelle</button>
          <button class="btn btn-sm btn-primary" (click)="setViewStyle('CARD')" [class.active]="vm.viewStyle === 'CARD'">Kacheln</button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span>Gruppierung:</span>
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" (click)="setGroupedBy('OFF')" [class.active]="vm.groupedBy === 'OFF'">Aus</button>
            <button class="btn btn-sm btn-primary" (click)="setGroupedBy('PRINTER')" [class.active]="vm.groupedBy === 'PRINTER'">
              Drucker
            </button>
          </div>
        </div>
      </div>

      <ng-container [ngSwitch]="vm.groupedBy">
        <div *ngSwitchCase="'OFF'">
          <ng-container [ngSwitch]="vm.viewStyle">
            <app-order-products-list-cards *ngSwitchCase="'CARD'" [orderProducts]="_orderProducts" />
            <app-order-products-list-table *ngSwitchCase="'TABLE'" [orderProducts]="_orderProducts" />
          </ng-container>
        </div>

        <ng-container *ngSwitchCase="'PRINTER'">
          <div class="mt-2 d-flex flex-column gap-3" *ngIf="groupedOrderProducts$ | async as grouped">
            <div class="card" *ngFor="let groups of grouped | keyvalue">
              <div class="card-header d-flex flex-wrap gap-2 justify-content-between mt-1">
                <h4 class="d-flex align-items-center gap-2">
                  <i-bs name="printer" width="24" height="24" /> {{ groups.value.printerName }}
                </h4>
                <div>
                  <button class="btn btn-sm btn-warning" (click)="requeueOrdersOfPrinter.next(groups.key)" *ngIf="showRequeueButton">
                    <i-bs name="printer" />
                    {{ 'HOME_ORDER_REQUEUE' | tr }}
                  </button>
                </div>
              </div>
              <div class="card-body">
                <ng-container [ngSwitch]="vm.viewStyle">
                  <app-order-products-list-cards *ngSwitchCase="'CARD'" [orderProducts]="groups.value.orderProducts" />
                  <app-order-products-list-table *ngSwitchCase="'TABLE'" [orderProducts]="groups.value.orderProducts" />
                </ng-container>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DfxTr,
    NgIf,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    NgForOf,
    AppOrderProductStateBadgeComponent,
    NgClass,
    DatePipe,
    RouterLink,
    KeyValuePipe,
    AppOrderProductsListTableComponent,
    AppOrderProductsListCardsComponent,
    AppIconsModule,
  ],
  selector: 'app-order-products-list',
  standalone: true,
})
export class AppOrderProductsListComponent {
  @Input({required: true}) set orderProducts(it: GetOrderProductResponse[]) {
    this._orderProducts = it;
    this.orderProducts$.next(this._orderProducts);
  }
  _orderProducts!: GetOrderProductResponse[];

  @Input({transform: booleanAttribute}) showRequeueButton = false;

  @Output() requeueOrdersOfPrinter = new EventEmitter<number>();

  orderProducts$ = new BehaviorSubject<GetOrderProductResponse[]>([]);

  viewStyle$ = new BehaviorSubject<orderProductViewStyleType>(
    (s_fromStorage('order_product_view_pref') as orderProductViewStyleType | undefined) ?? 'TABLE'
  );

  setViewStyle(it: orderProductViewStyleType) {
    this.viewStyle$.next(it);
    st_set('order_product_view_pref', it);
  }
  groupedBy$ = new BehaviorSubject<orderProductGroupedByType>(
    (s_fromStorage('order_product_grouped_pref') as orderProductGroupedByType | undefined) ?? 'OFF'
  );

  setGroupedBy(it: orderProductGroupedByType) {
    this.groupedBy$.next(it);
    st_set('order_product_grouped_pref', it);
  }

  groupedOrderProducts$ = combineLatest([this.orderProducts$, this.groupedBy$]).pipe(
    map(([orderProducts, key]) => {
      const groups = new Map<number, groupedType>();
      for (const orderProduct of orderProducts) {
        const group = groups.get(orderProduct.printedBy.id) ?? {printerName: orderProduct.printedBy.name, orderProducts: []};
        group.orderProducts.push(orderProduct);
        groups.set(orderProduct.printedBy.id, group);
      }
      return groups;
    }),
    tap((it) => console.log(it))
  );

  vm$ = combineLatest([this.viewStyle$, this.groupedBy$]).pipe(map(([viewStyle, groupedBy]) => ({viewStyle, groupedBy})));
}

type orderProductViewStyleType = 'CARD' | 'TABLE';
type orderProductGroupedByType = 'OFF' | 'PRINTER';

type groupedType = {
  printerName: string;
  orderProducts: GetOrderProductResponse[];
};

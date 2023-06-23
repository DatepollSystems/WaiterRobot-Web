import {AsyncPipe, DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {s_fromStorage, st_set} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {BehaviorSubject, combineLatest, map} from 'rxjs';
import {GetOrderProductResponse} from '../../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';
import {AppOrderProductsListCardsComponent} from './app-order-products-list-cards.component';
import {AppOrderProductsListTableComponent} from './app-order-products-list-table.component';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="d-flex justify-content-between">
        <div class="btn-group mb-2">
          <button class="btn btn-sm btn-primary" (click)="setViewStyle('TABLE')" [class.active]="vm.viewStyle === 'TABLE'">Tabelle</button>
          <button class="btn btn-sm btn-primary" (click)="setViewStyle('CARD')" [class.active]="vm.viewStyle === 'CARD'">Kacheln</button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span>Gruppiert nach:</span>
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
          <div class="mt-2" *ngIf="groupedOrderProducts$ | async as grouped">
            <div class="card" *ngFor="let groups of grouped | keyvalue">
              <h4 class="card-header">{{ groups.key }}</h4>
              <div class="card-body">
                <ng-container [ngSwitch]="vm.viewStyle">
                  <app-order-products-list-cards *ngSwitchCase="'CARD'" [orderProducts]="groups.value" />
                  <app-order-products-list-table *ngSwitchCase="'TABLE'" [orderProducts]="groups.value" />
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
    map(([orderProducts, key]) => groupBy(orderProducts, (it) => it.printedBy.name))
  );

  vm$ = combineLatest([this.viewStyle$, this.groupedBy$]).pipe(map(([viewStyle, groupedBy]) => ({viewStyle, groupedBy})));
}

type orderProductViewStyleType = 'CARD' | 'TABLE';
type orderProductGroupedByType = 'OFF' | 'PRINTER';

export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as {[key: string]: T[]});

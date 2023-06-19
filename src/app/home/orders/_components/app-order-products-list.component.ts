import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {s_fromStorage, st_set} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {BehaviorSubject} from 'rxjs';
import {GetOrderProductResponse} from '../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from './app-order-product-state-badge.component';
import {AppOrderProductsListTable} from './app-order-products-list-table.component';

@Component({
  template: `
    <ng-container *ngIf="orderProductViewStyle$ | async as orderProductViewStyle">
      <div class="d-flex justify-content-end">
        <div class="btn-group mb-2">
          <button
            class="btn btn-sm btn-primary"
            (click)="setOrderProductViewStyle('TABLE')"
            [class.active]="orderProductViewStyle === 'TABLE'"
          >
            Tabelle
          </button>
          <button
            class="btn btn-sm btn-primary"
            (click)="setOrderProductViewStyle('CARD')"
            [class.active]="orderProductViewStyle === 'CARD'"
          >
            Kacheln
          </button>
        </div>
      </div>

      <ng-container [ngSwitch]="orderProductViewStyle">
        <div class="row g-2" *ngSwitchCase="'CARD'">
          <div class="col-12 col-md-6 col-xl-4 col-xxl-3" *ngFor="let orderProduct of orderProducts; index as i">
            <div class="card">
              <div class="card-body d-flex flex-column gap-3">
                <div class="d-flex flex-column flex-md-row w-100 justify-content-between">
                  <div class="fw-bold">
                    {{ i + 1 }}.
                    <a routerLink="/home/products/{{ orderProduct.product.id }}">{{ orderProduct.product.name }}</a>
                  </div>
                  <app-order-product-state-badge [printState]="orderProduct.printState" />
                </div>

                <div class="row row-cols-auto gap-2 mx-2">
                  <span class="badge bg-primary rounded-pill">Anzahl: {{ orderProduct.amount }}</span>
                  <a class="badge bg-primary rounded-pill" routerLink="/home/printers/{{ orderProduct.printedBy.id }}">{{
                    orderProduct.printedBy.name
                  }}</a>
                  <span
                    class="badge rounded-pill"
                    [ngClass]="{'bg-secondary': !orderProduct.sentToPrinterAt, 'bg-success': orderProduct.sentToPrinterAt}"
                    >Gesendet:
                    <span *ngIf="orderProduct.sentToPrinterAt; else sentToPrinterUnknown">{{
                      orderProduct.sentToPrinterAt | date : 'HH:mm:ss'
                    }}</span>
                    <ng-template #sentToPrinterUnknown>{{ 'UNKNOWN' | tr }}</ng-template></span
                  >
                  <span
                    class="badge rounded-pill"
                    [ngClass]="{'bg-secondary': !orderProduct.printedAt, 'bg-success': orderProduct.printedAt}"
                    >Gedruckt:
                    <span *ngIf="orderProduct.printedAt; else printedAtUnknown">{{ orderProduct.printedAt | date : 'HH:mm:ss' }}</span>
                    <ng-template #printedAtUnknown>{{ 'UNKNOWN' | tr }}</ng-template></span
                  >
                </div>

                <ul class="list-group" *ngIf="orderProduct.note">
                  <li class="list-group-item">
                    {{ 'HOME_ORDER_NOTE' | tr }}: <code>{{ orderProduct.note }}</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <app-order-products-list-table *ngSwitchCase="'TABLE'" [orderProducts]="orderProducts" />
      </ng-container>
    </ng-container>
  `,
  standalone: true,
  selector: 'app-order-products-list',
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
    AppOrderProductsListTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderProductsListComponent {
  @Input({required: true}) orderProducts!: GetOrderProductResponse[];

  orderProductViewStyle$ = new BehaviorSubject<orderProductViewStyleType>(
    (s_fromStorage('order_product_view_pref') as orderProductViewStyleType | undefined) ?? 'TABLE'
  );
  setOrderProductViewStyle(it: orderProductViewStyleType) {
    this.orderProductViewStyle$.next(it);
    st_set('order_product_view_pref', it);
  }
}

type orderProductViewStyleType = 'CARD' | 'TABLE';

import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {GetOrderProductResponse} from '../../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';

@Component({
  template: `
    <div class="row g-2">
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
                  orderProduct.sentToPrinterAt | date : 'dd.MM. HH:mm:ss'
                }}</span>
                <ng-template #sentToPrinterUnknown>{{ 'UNKNOWN' | tr }}</ng-template></span
              >
              <span class="badge rounded-pill" [ngClass]="{'bg-secondary': !orderProduct.printedAt, 'bg-success': orderProduct.printedAt}"
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
  `,
  styles: [
    `
      .list-group-flush .list-group-item {
        padding-left: 0;
      }

      a.badge:hover {
        color: #ffffff;
      }
    `,
  ],
  standalone: true,
  selector: 'app-order-products-list-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppOrderProductStateBadgeComponent, DatePipe, DfxTr, NgForOf, NgIf, RouterLink, NgClass],
})
export class AppOrderProductsListCardsComponent {
  @Input({required: true}) orderProducts!: GetOrderProductResponse[];
}

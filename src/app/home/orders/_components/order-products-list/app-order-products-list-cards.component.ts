import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from '../../../../_shared/ui/icons.module';
import {GetOrderProductResponse} from '../../../../_shared/waiterrobot-backend';
import {AppOrderProductStateBadgeComponent} from '../app-order-product-state-badge.component';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <div class="row g-2">
      <div class="col-12 col-md-6 col-xl-4 col-xxl-3" *ngFor="let orderProduct of orderProducts; index as i">
        <div class="card">
          <div class="card-body d-flex flex-column gap-3">
            <div class="d-flex flex-column flex-md-row w-100 justify-content-between">
              <div class="fw-bold">
                {{ i + 1 }})
                <a routerLink="/home/products/{{ orderProduct.product.id }}">{{ orderProduct.product.name }}</a>
                ({{ orderProduct.amount }}x)
              </div>
              <app-order-product-state-badge [printState]="orderProduct.printState" />
            </div>

            <div class="row row-cols-auto gap-2 mx-2">
              <a
                class="badge bg-primary rounded-pill d-flex align-items-center gap-2"
                ngbTooltip="{{ 'HOME_ORDER_OPEN_PRINTER' | tr }}"
                routerLink="/home/printers/{{ orderProduct.printedBy.id }}"
              >
                <i-bs name="printer" />
                {{ orderProduct.printedBy.name }}
              </a>
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
  imports: [AppOrderProductStateBadgeComponent, DatePipe, DfxTr, NgForOf, NgIf, RouterLink, NgClass, AppIconsModule, NgbTooltip],
})
export class AppOrderProductsListCardsComponent {
  @Input({required: true}) orderProducts!: GetOrderProductResponse[];
}

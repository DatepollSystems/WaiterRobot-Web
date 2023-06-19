import {AsyncPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {map, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../_shared/services/getActivatedRouteIdParam';
import {AppBackButtonComponent} from '../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppOrderCountdownComponent} from './_components/app-order-countdown.component';
import {AppOrderProductsListComponent} from './_components/app-order-products-list.component';
import {AppOrderStateBadgeComponent} from './_components/app-order-state-badge.component';
import {OrdersService} from './orders.service';

@Component({
  template: `
    <ng-container *ngIf="order$ | async as order">
      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 gap-md-0">
        <div class="d-flex flex-column flex-md-row gap-1 gap-md-4 align-items-start align-items-md-center">
          <div>
            <h1 class="mb-0">Bestellung #{{ order.orderNumber }}</h1>
          </div>
          <div>
            <app-order-state-badge [orderState]="order.state" />
          </div>
        </div>
        <app-order-countdown [countdown]="(countdown$ | async) ?? 0" />
      </div>
      <div class="d-flex gap-2 my-3 my-md-2">
        <span class="badge bg-success rounded-pill">Erstellt um: {{ order.createdAt | date : 'HH:mm:ss' }}</span>
        <span class="badge rounded-pill" [ngClass]="{'bg-secondary': !order.processedAt, 'bg-success': order.processedAt}"
          >Verarbeitet um: <span *ngIf="order.processedAt; else sentToPrinterUnknown">{{ order.processedAt | date : 'HH:mm:ss' }}</span>
          <ng-template #sentToPrinterUnknown>Unbekannt</ng-template></span
        >
      </div>
      <btn-toolbar>
        <back-button />
        <div>
          <a class="btn btn-sm btn-outline-primary" routerLink="/home/waiters/{{ order.waiter.id }}">
            <i-bs name="people" />
            Kellner öffnen ({{ order.waiter.name }})
          </a>
        </div>
        <div class="btn-group">
          <a class="btn btn-outline-secondary btn-sm" routerLink="/home/tables/{{ order.table.id }}">
            <i-bs name="columns-gap" />
            Tisch öffnen ({{ order.table.group.name }} - {{ order.table.number }})
          </a>
          <div class="btn-group" ngbDropdown role="group" aria-label="Button group with nested dropdown" container="body">
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" ngbDropdownToggle></button>
            <ul class="dropdown-menu" ngbDropdownMenu>
              <a ngbDropdownItem routerLink="/home/tables/groups/tables/{{ order.table.group.id }}">
                <i-bs name="diagram-3" />
                Tischgruppe öffnen</a
              >
              <a ngbDropdownItem routerLink="/home/tables/groups/{{ order.table.group.id }}">
                <i-bs name="pencil-square" />
                Tischgruppe bearbeiten</a
              >
            </ul>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-danger text-white" (click)="requeueOrder(order.id)">REQUEUE</button>
        </div>
      </btn-toolbar>

      <app-order-products-list [orderProducts]="order.orderProducts" />
    </ng-container>
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
  selector: 'app-orders-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    AppBtnToolbarComponent,
    AppBackButtonComponent,
    AppOrderStateBadgeComponent,
    AppOrderCountdownComponent,
    AppIconsModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbDropdownItem,
    AppOrderProductsListComponent,
    NgClass,
    RouterLink,
  ],
})
export class OrderInfoComponent {
  ordersService = inject(OrdersService);
  order$ = getActivatedRouteIdParam().pipe(
    switchMap((id) => this.ordersService.getSingle$(id)),
    map((order) => {
      order.orderProducts = [...order.orderProducts, ...order.orderProducts, ...order.orderProducts];
      return order;
    })
  );
  countdown$ = this.ordersService.countdown$();

  requeueOrder(id: number) {
    this.ordersService.requeueOrder(id).subscribe();
  }
}

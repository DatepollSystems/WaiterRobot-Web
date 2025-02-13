import {Component, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {map, shareReplay, switchMap, timer} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {StopPropagationDirective} from 'dfx-helper';
import {deriveLoading} from 'ngxtension/derive-loading';

import {AppTestBadge} from '@home-shared/components/app-test-badge.component';

import {AppProgressBarComponent} from '@shared/ui/loading';

import {AppOrderStateBadgeComponent} from '../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../orders/orders.service';

@Component({
  template: `
    <div class="card p-2">
      <div class="card-body">
        <h5 class="card-title">{{ 'Neue Bestellungen' | transloco }}</h5>

        @let showLoading = showOrdersLoading();

        <div class="list-group list-group-flush">
          @for (order of orders(); track order.id) {
            <a
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              [routerLink]="'o/organisationId/e/eventId/orders/' + order.id"
            >
              <div class="d-flex flex-column gap-2">
                <div class="d-inline-flex gap-0 gap-sm-2 flex-column flex-sm-row">
                  <div class="fw-bold">#{{ order.orderNumber }}</div>
                  <span>
                    (<a [routerLink]="'o/organisationId/e/eventId/tables/' + order.table.group.id" stopPropagation>{{
                      order.table.group.name
                    }}</a>
                    -
                    <a [routerLink]="'o/organisationId/e/eventId/tables/t/' + order.table.id" stopPropagation>{{ order.table.number }}</a
                    >)
                  </span>
                </div>
                <div>
                  <a [routerLink]="'o/organisationId/e/eventId/waiters/waiter/' + order.waiter.id" stopPropagation>
                    {{ order.waiter.name }}
                  </a>
                </div>
              </div>

              <div class="d-flex flex-column align-items-end gap-2">
                <app-order-state-badge
                  [orderState]="order.state"
                  [orderProductPrintStates]="order.orderProductPrintStates"
                  [createdAt]="order.createdAt"
                  [processedAt]="order.processedAt"
                  placement="left"
                />

                @if (order.test) {
                  <app-test-badge />
                }
              </div>
            </a>
          } @empty {
            @if (!showLoading) {
              Keine Bestellungen vorhanden.
            }
          }
          @if (showLoading) {
            <app-progress-bar show />
          }
        </div>
      </div>
    </div>
  `,
  selector: 'wr-orders-card',
  imports: [AppOrderStateBadgeComponent, AppProgressBarComponent, AppTestBadge, StopPropagationDirective, TranslocoPipe, RouterLink],
})
export class OrdersCard {
  #ordersService = inject(OrdersService);

  #orders$ = timer(0, 10000).pipe(
    switchMap(() =>
      this.#ordersService.getAllPaginated({
        page: 0,
        size: 8,
        sort: ['createdAt,desc'],
      }),
    ),
    map((it) => it.data),
    takeUntilDestroyed(),
    shareReplay(),
  );

  orders = toSignal(this.#orders$, {initialValue: []});

  showOrdersLoading = toSignal(this.#orders$.pipe(deriveLoading({threshold: 0, loadingTime: 0})), {requireSync: true});
}

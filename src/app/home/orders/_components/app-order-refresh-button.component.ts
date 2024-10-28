import {ChangeDetectionStrategy, Component, booleanAttribute, inject, input} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import {OrdersService} from '../orders.service';

@Component({
  template: `
    <button
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      [class.btnSpinner]="loading()"
      [ngbTooltip]="'HOME_ORDER_REFRESH_NOW' | transloco"
      (mousedown)="ordersService.triggerRefresh.next(true)"
      type="button"
      placement="left"
    >
      <bi name="arrow-clockwise" />
      @if (countdown()) {
        <span class="badge text-bg-secondary">{{ countdown() }}</span>
      }
    </button>
  `,
  standalone: true,
  selector: 'app-order-refresh-btn',
  imports: [TranslocoPipe, NgbTooltip, BiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderRefreshButtonComponent {
  ordersService = inject(OrdersService);

  countdown = input<number>();

  loading = input(booleanAttribute(false), {transform: booleanAttribute});
}

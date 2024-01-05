import {booleanAttribute, ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {OrdersService} from '../orders.service';

@Component({
  template: `
    <button
      type="button"
      [class.spinner]="loading"
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      (click)="ordersService.triggerRefresh.next(true)"
      ngbTooltip="{{ 'HOME_ORDER_REFRESH_NOW' | tr }}"
      placement="left"
    >
      <bi name="arrow-clockwise" />
      @if (countdown) {
        <span class="badge text-bg-secondary">{{ countdown }}</span>
      }
    </button>
  `,
  standalone: true,
  selector: 'app-order-refresh-btn',
  imports: [DfxTr, NgbTooltip, BiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderRefreshButtonComponent {
  ordersService = inject(OrdersService);

  @Input() countdown?: number;

  @Input({transform: booleanAttribute}) loading = false;
}

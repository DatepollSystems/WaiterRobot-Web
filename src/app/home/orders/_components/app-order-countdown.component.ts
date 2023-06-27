import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {OrdersService} from '../orders.service';

@Component({
  template: `
    <button
      type="button"
      class="btn btn-outline-secondary"
      (click)="ordersService.triggerRefresh.next(false)"
      ngbTooltip="{{ 'HOME_ORDER_REFRESH_NOW' | tr }}"
      placement="left"
    >
      {{ 'HOME_ORDER_NEXT_REFRESH' | tr }} <span class="badge text-bg-secondary">{{ countdown }}</span>
    </button>
  `,
  standalone: true,
  selector: 'app-order-countdown',
  imports: [DfxTr, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderCountdownComponent {
  ordersService = inject(OrdersService);

  @Input({required: true}) countdown!: number;
}
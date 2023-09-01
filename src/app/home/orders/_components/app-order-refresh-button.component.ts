import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {OrdersService} from '../orders.service';

@Component({
  template: `
    <button
      type="button"
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      (click)="ordersService.triggerRefresh.next(true)"
      ngbTooltip="{{ 'HOME_ORDER_REFRESH_NOW' | tr }}"
      placement="left"
    >
      <i-bs name="arrow-clockwise" />
      <span class="badge text-bg-secondary" *ngIf="countdown">{{ countdown }}</span>
    </button>
  `,
  standalone: true,
  selector: 'app-order-refresh-btn',
  imports: [DfxTr, NgbTooltip, AppIconsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppOrderRefreshButtonComponent {
  ordersService = inject(OrdersService);

  @Input() countdown?: number;
}

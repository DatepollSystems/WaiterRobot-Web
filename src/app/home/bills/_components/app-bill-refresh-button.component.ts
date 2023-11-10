import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {BillsService} from '../bills.service';

@Component({
  template: `
    <button
      type="button"
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      (click)="billsService.triggerRefresh.next(true)"
      ngbTooltip="{{ 'HOME_ORDER_REFRESH_NOW' | tr }}"
      placement="left"
    >
      <bi name="arrow-clockwise" />
      <span class="badge text-bg-secondary" *ngIf="countdown">{{ countdown }}</span>
    </button>
  `,
  standalone: true,
  selector: 'app-bill-refresh-btn',
  imports: [DfxTr, NgbTooltip, BiComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBillRefreshButtonComponent {
  billsService = inject(BillsService);

  @Input() countdown?: number;
}

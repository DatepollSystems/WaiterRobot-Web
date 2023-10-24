import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../../../_shared/ui/icons.module';
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
      <i-bs name="arrow-clockwise" />
      <span class="badge text-bg-secondary" *ngIf="countdown">{{ countdown }}</span>
    </button>
  `,
  standalone: true,
  selector: 'app-bill-refresh-btn',
  imports: [DfxTr, NgbTooltip, AppIconsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBillRefreshButtonComponent {
  billsService = inject(BillsService);

  @Input() countdown?: number;
}

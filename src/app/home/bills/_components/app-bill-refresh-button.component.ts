import {booleanAttribute, ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {BillsService} from '../_services/bills.service';

@Component({
  template: `
    <button
      type="button"
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      placement="left"
      [class.btnSpinner]="loading"
      [ngbTooltip]="'HOME_ORDER_REFRESH_NOW' | transloco"
      (mousedown)="billsService.triggerRefresh.next(true)"
    >
      <bi name="arrow-clockwise" />
      @if (countdown) {
        <span class="badge text-bg-secondary">{{ countdown }}</span>
      }
    </button>
  `,
  standalone: true,
  selector: 'app-bill-refresh-btn',
  imports: [TranslocoPipe, NgbTooltip, BiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBillRefreshButtonComponent {
  billsService = inject(BillsService);

  @Input() countdown?: number;
  @Input({transform: booleanAttribute}) loading = false;
}

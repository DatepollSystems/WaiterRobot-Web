import {ChangeDetectionStrategy, Component, booleanAttribute, inject, input} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import {BillsService} from '../_services/bills.service';

@Component({
  template: `
    <button
      class="btn btn-outline-secondary d-flex align-items-center gap-2"
      [class.btnSpinner]="loading()"
      [ngbTooltip]="'HOME_ORDER_REFRESH_NOW' | transloco"
      (mousedown)="billsService.triggerRefresh.next(true)"
      type="button"
      placement="left"
    >
      <bi name="arrow-clockwise" />
      @if (countdown()) {
        <span class="badge text-bg-secondary">{{ countdown() }}</span>
      }
    </button>
  `,
  selector: 'app-bill-refresh-btn',
  imports: [TranslocoPipe, NgbTooltip, BiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBillRefreshButtonComponent {
  billsService = inject(BillsService);

  countdown = input<number>();
  loading = input(booleanAttribute(false), {transform: booleanAttribute});
}

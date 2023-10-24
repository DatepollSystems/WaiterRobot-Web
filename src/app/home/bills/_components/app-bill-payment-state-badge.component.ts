import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {GetBillResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div
      [ngClass]="{
        'text-bg-warning': paymentState === 'UNPAID',
        'text-bg-success': paymentState === 'PAID'
      }"
      class="badge not-selectable"
      style="width: min-content"
    >
      <ng-container [ngSwitch]="paymentState">
        <div *ngSwitchCase="'PAID'" class="d-flex gap-2 align-items-center">
          <i-bs name="check2-square" />
          <span>{{ 'Bezahlt' | tr }}</span>
        </div>
        <div
          *ngSwitchCase="'UNPAID'"
          class="d-flex gap-2 align-items-center"
          [ngbPopover]="unpaidReason ? popContent : null"
          placement="right"
          triggers="mouseenter:mouseleave"
          popoverTitle="Rechnungsdetails"
        >
          <i-bs name="cone-striped" />
          <span>{{ 'Unbezahlt' | tr }}</span>
        </div>
      </ng-container>
    </div>
    <ng-template #popContent class="d-flex flex-column">
      <div>Grund: {{ unpaidReason }}</div>
    </ng-template>
  `,
  standalone: true,
  selector: 'app-bill-payment-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AppIconsModule, DfxTr, NgSwitch, NgSwitchCase, DatePipe, NgIf, NgbPopover],
})
export class AppBillPaymentStateBadgeComponent {
  @Input({required: true}) paymentState!: GetBillResponse['paymentState'];
  @Input() unpaidReason?: string;
}

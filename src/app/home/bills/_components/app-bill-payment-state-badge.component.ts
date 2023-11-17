import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div
      [ngClass]="{
        'text-bg-warning': !!unpaidReason,
        'text-bg-success': !unpaidReason
      }"
      class="badge not-selectable"
      style="width: min-content"
    >
      @if (!unpaidReason) {
        <div class="d-flex gap-2 align-items-center">
          <span>{{ 'Bezahlt' | tr }}</span>
          <bi name="check2-square" />
        </div>
      } @else {
        @switch (unpaidReason) {
          @case ('Test') {
            <div class="d-flex gap-2 align-items-center">
              <span>{{ 'Test' | tr }}</span>
              <bi name="terminal-fill" />
            </div>
          }
          @default {
            <div
              class="d-flex gap-2 align-items-center"
              [ngbPopover]="unpaidReason ? popContent : null"
              placement="right"
              triggers="mouseenter:mouseleave"
              popoverTitle="Rechnungsdetails"
            >
              <span>{{ 'Unbezahlt' | tr }}</span>
              <bi name="cone-striped" />
            </div>

            <ng-template #popContent class="d-flex flex-column">
              <div>Grund: {{ unpaidReason }}</div>
            </ng-template>
          }
        }
      }
    </div>
  `,
  standalone: true,
  selector: 'app-bill-payment-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, DfxTr, NgbPopover],
})
export class AppBillPaymentStateBadgeComponent {
  @Input() unpaidReason?: string;
}

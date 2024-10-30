import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div
      class="badge not-selectable"
      [ngClass]="{
        'text-bg-warning': !!unpaidReason(),
        'text-bg-success': !unpaidReason(),
      }"
      style="width: min-content"
    >
      @if (!unpaidReason()) {
        <div class="d-flex gap-2 align-items-center">
          <span>{{ 'Bezahlt' | transloco }}</span>
          <bi name="check2-square" />
        </div>
      } @else {
        @switch (unpaidReason()) {
          @case ('Test') {
            <div class="d-flex gap-2 align-items-center">
              <span>{{ 'HOME_ORDER_TEST' | transloco }}</span>
              <bi name="terminal-fill" />
            </div>
          }
          @default {
            <div
              class="d-flex gap-2 align-items-center"
              [ngbPopover]="unpaidReason() ? popContent : null"
              placement="right"
              triggers="mouseenter:mouseleave"
              popoverTitle="Rechnungsdetails"
            >
              <span>{{ 'Unbezahlt' | transloco }}</span>
              <bi name="cone-striped" />
            </div>

            <ng-template class="d-flex flex-column" #popContent>
              <div>Grund: {{ unpaidReason() }}</div>
            </ng-template>
          }
        }
      }
    </div>
  `,
  standalone: true,
  selector: 'app-bill-payment-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, TranslocoPipe, NgbPopover],
})
export class AppBillPaymentStateBadgeComponent {
  unpaidReason = input<string>();
}

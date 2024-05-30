import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div
      class="badge not-selectable"
      style="width: min-content"
      [ngClass]="{
        'text-bg-warning': !!unpaidReason,
        'text-bg-success': !unpaidReason
      }"
    >
      @if (!unpaidReason) {
        <div class="d-flex gap-2 align-items-center">
          <span>{{ 'Bezahlt' | transloco }}</span>
          <bi name="check2-square" />
        </div>
      } @else {
        @switch (unpaidReason) {
          @case ('Test') {
            <div class="d-flex gap-2 align-items-center">
              <span>{{ 'HOME_ORDER_TEST' | transloco }}</span>
              <bi name="terminal-fill" />
            </div>
          }
          @default {
            <div
              class="d-flex gap-2 align-items-center"
              placement="right"
              triggers="mouseenter:mouseleave"
              popoverTitle="Rechnungsdetails"
              [ngbPopover]="unpaidReason ? popContent : null"
            >
              <span>{{ 'Unbezahlt' | transloco }}</span>
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
  imports: [NgClass, BiComponent, TranslocoPipe, NgbPopover],
})
export class AppBillPaymentStateBadgeComponent {
  @Input() unpaidReason?: string;
}

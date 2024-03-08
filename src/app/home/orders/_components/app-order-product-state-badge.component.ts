import {DatePipe, NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
      [ngClass]="{'text-bg-light': printState === 'QUEUED', 'text-bg-success': printState === 'SENT_TO_PRINT'}"
      [ngbTooltip]="sentToPrinterAt || printedAt ? tipContent : null"
    >
      @switch (printState) {
        @case ('QUEUED') {
          <span>{{ 'HOME_ORDER_QUEUED' | transloco }}</span>
        }
        @case ('SENT_TO_PRINT') {
          <span>{{ 'HOME_ORDER_SENT_TO_PRINT' | transloco }}</span>
        }
        @case ('PRINTED') {
          <span>{{ 'HOME_ORDER_PROCESSED' | transloco }}</span>
        }
      }

      @if (printState === 'QUEUED') {
        <div class="circle pulse green"></div>
      } @else {
        <bi name="check2-square" />
      }
    </div>
    <ng-template #tipContent>
      @switch (printState) {
        @case ('SENT_TO_PRINT') {
          <span>{{ sentToPrinterAt | date: 'dd.MM.yy HH:mm:ss' }}</span>
        }
        @case ('PRINTED') {
          <span>{{ printedAt | date: 'dd.MM.yy HH:mm:ss' }}</span>
        }
      }
    </ng-template>
  `,
  styles: [
    `
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0px 0px 1px 1px #0000001a;
      }

      .pulse {
        animation: pulse-animation 2s infinite;
      }

      .green {
        background: #66ff99;
      }

      @keyframes pulse-animation {
        0% {
          box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.3);
        }
        100% {
          box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }
      }
    `,
  ],
  standalone: true,
  selector: 'app-order-product-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, TranslocoPipe, DatePipe, NgbTooltip],
})
export class AppOrderProductStateBadgeComponent {
  @Input({required: true}) printState!: 'PRINTED' | 'SENT_TO_PRINT' | 'QUEUED';

  @Input() sentToPrinterAt?: string;
  @Input() printedAt?: string;
}

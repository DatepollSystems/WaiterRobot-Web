import {DatePipe, NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {GetImplodedOrderProductResponse, GetOrderResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <span
      placement="right"
      triggers="mouseenter:mouseleave"
      popoverTitle="Bestelldetails"
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
      [ngClass]="{
        'text-bg-light': orderState === 'QUEUED' || orderState === 'IN_PROGRESS',
        'text-bg-success': orderState === 'FINISHED'
      }"
      [ngbPopover]="popContent"
    >
      @switch (orderState) {
        @case ('QUEUED') {
          <span>{{ 'HOME_ORDER_QUEUED' | transloco }}</span>
        }
        @case ('IN_PROGRESS') {
          <span>{{ 'HOME_ORDER_IN_WORK' | transloco }}</span>
        }
        @case ('FINISHED') {
          <span>{{ 'HOME_ORDER_PROCESSED' | transloco }}</span>
        }
      }

      @if (orderState === 'QUEUED' || orderState === 'IN_PROGRESS') {
        <div class="circle pulse green"></div>
      } @else {
        <bi name="check2-square" />
      }
    </span>
    <ng-template #popContent class="d-flex flex-column">
      @if (createdAt) {
        <div>{{ 'HOME_ORDER_CREATED_AT' | transloco }}: {{ createdAt | date: 'dd.MM.yy HH:mm:ss' }}</div>
      }
      @if (processedAt) {
        <div>Verarbeitet um: {{ processedAt | date: 'dd.MM.yy HH:mm:ss' }}</div>
      }
      <div>Gedruckte Produkte: {{ printedProducts }} von {{ allProducts }}</div>
    </ng-template>
  `,
  styles: [
    `
      .circle {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        box-shadow: 0 0 1px 1px #0000001a;
      }

      .pulse {
        animation: pulse-animation 2s infinite;
      }

      .green {
        background: #66ff99;
      }

      @keyframes pulse-animation {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
        }
        100% {
          box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }
      }
    `,
  ],
  standalone: true,
  selector: 'app-order-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, BiComponent, TranslocoPipe, NgbTooltip, DatePipe, NgbPopover],
})
export class AppOrderStateBadgeComponent {
  @Input({required: true}) orderState!: GetOrderResponse['state'];
  @Input({required: true}) set orderProductPrintStates(it: GetImplodedOrderProductResponse['printState'][]) {
    this.allProducts = it.length;
    this.printedProducts = it.length - it.filter((iit) => iit === 'QUEUED').length;
  }
  allProducts = 0;
  printedProducts = 0;

  @Input() processedAt?: string;
  @Input() createdAt?: string;
}

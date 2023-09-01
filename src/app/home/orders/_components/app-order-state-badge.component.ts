import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {GetOrderProductResponse, GetOrderResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div
      [ngClass]="{
        'text-bg-light': orderState === 'QUEUED' || orderState === 'IN_PROGRESS',
        'text-bg-success': orderState === 'FINISHED'
      }"
      [ngbPopover]="popContent"
      placement="right"
      triggers="mouseenter:mouseleave"
      popoverTitle="Bestelldetails"
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
    >
      <ng-container [ngSwitch]="orderState">
        <span *ngSwitchCase="'QUEUED'">{{ 'HOME_ORDER_QUEUED' | tr }}</span>
        <span *ngSwitchCase="'IN_PROGRESS'">{{ 'HOME_ORDER_IN_WORK' | tr }}</span>
        <span *ngSwitchCase="'FINISHED'">{{ 'HOME_ORDER_PROCESSED' | tr }}</span>
      </ng-container>

      <div class="circle pulse green" *ngIf="orderState === 'QUEUED' || orderState === 'IN_PROGRESS'; else processed"></div>
      <ng-template #processed>
        <i-bs name="check2-square" />
      </ng-template>
    </div>
    <ng-template #popContent class="d-flex flex-column">
      <div *ngIf="createdAt">Erstellt um: {{ createdAt | date: 'dd.MM. HH:mm:ss' }}</div>
      <div *ngIf="processedAt">Verarbeitet um: {{ processedAt | date: 'dd.MM. HH:mm:ss' }}</div>
      <div>Gedruckte Produkte: {{ printedProducts }} von {{ allProducts }}</div>
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
  selector: 'app-order-state-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AppIconsModule, NgIf, DfxTr, NgbTooltip, DatePipe, NgbPopover, NgSwitch, NgSwitchCase],
})
export class AppOrderStateBadgeComponent {
  @Input({required: true}) orderState!: GetOrderResponse['state'];
  @Input({required: true}) set orderProductStates(it: GetOrderProductResponse['printState'][]) {
    this.allProducts = it.length;
    this.printedProducts = it.length - it.filter((iit) => iit === 'QUEUED').length;
  }
  includesQueued = false;
  allProducts = 0;
  printedProducts = 0;

  @Input() processedAt?: string;
  @Input() createdAt?: string;
}

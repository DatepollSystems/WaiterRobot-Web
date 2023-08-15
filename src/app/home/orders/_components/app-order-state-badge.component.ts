import {DatePipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {GetOrderProductResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <div
      [ngClass]="{
        'text-bg-light': orderState === 'QUEUED' || includesQueued,
        'text-bg-success': orderState === 'PROCESSED' && !includesQueued
      }"
      [ngbPopover]="processedAt || createdAt ? popContent : null"
      placement="right"
      triggers="mouseenter:mouseleave"
      popoverTitle="Bestelldetails"
      class="badge d-flex align-items-center gap-2 not-selectable"
      style="width: min-content"
    >
      <span *ngIf="orderState === 'QUEUED'; else queuedOrderProductsOrProcessedText">{{ 'HOME_ORDER_QUEUED' | tr }}</span>
      <ng-template #queuedOrderProductsOrProcessedText>
        <span *ngIf="includesQueued; else processedText">{{ 'HOME_ORDER_IN_WORK' | tr }}</span>
        <ng-template #processedText>
          <span>{{ 'HOME_ORDER_PROCESSED' | tr }}</span>
        </ng-template>
      </ng-template>
      <div class="circle pulse green" *ngIf="orderState === 'QUEUED' || includesQueued; else processed"></div>
      <ng-template #processed>
        <i-bs name="check2-square" />
      </ng-template>
    </div>
    <ng-template #popContent class="d-flex flex-column">
      <div *ngIf="createdAt">Erstellt um: {{ createdAt | date: 'dd.MM. HH:mm:ss' }}</div>
      <div *ngIf="processedAt">Verarbeitet um: {{ processedAt | date: 'dd.MM. HH:mm:ss' }}</div>
      <div *ngIf="queuedProducts !== 0">Ungedruckte Produkte: {{ queuedProducts }}</div>
      <div *ngIf="printedProducts !== 0">Gedruckte Produkte: {{ printedProducts }}</div>
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
  imports: [NgClass, AppIconsModule, NgIf, DfxTr, NgbTooltip, DatePipe, NgbPopover],
})
export class AppOrderStateBadgeComponent {
  @Input({required: true}) orderState!: 'QUEUED' | 'PROCESSED';
  @Input({required: true}) set orderProductStates(it: GetOrderProductResponse['printState'][]) {
    this.includesQueued = it.includes('QUEUED');
    this.queuedProducts = it.filter((iit) => iit === 'QUEUED').length;
    this.printedProducts = it.length - this.queuedProducts;
  }
  includesQueued = false;
  queuedProducts = 0;
  printedProducts = 0;

  @Input() processedAt?: string;
  @Input() createdAt?: string;
}

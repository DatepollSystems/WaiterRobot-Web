import {NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from '../../../_shared/ui/icons.module';

@Component({
  template: `
    <div
      [ngClass]="{'text-bg-light': orderState === 'QUEUED', 'text-bg-success': orderState === 'PROCESSED'}"
      class="badge d-flex align-items-center gap-2"
      style="width: min-content"
    >
      <ng-template #processed>
        <i-bs name="check2-square" />
      </ng-template>
      <span *ngIf="orderState === 'QUEUED'; else processedText">{{ 'HOME_ORDER_QUEUED' | tr }}</span>
      <ng-template #processedText>
        <span>{{ 'HOME_ORDER_PROCESSED' | tr }}</span>
      </ng-template>
      <div class="circle pulse green" *ngIf="orderState === 'QUEUED'; else processed"></div>
    </div>
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
  imports: [NgClass, AppIconsModule, NgIf, DfxTr],
})
export class AppOrderStateBadgeComponent {
  @Input({required: true}) orderState!: 'QUEUED' | 'PROCESSED';
}
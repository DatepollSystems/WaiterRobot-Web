import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <div
      [ngClass]="{'text-bg-light': printState === 'QUEUED', 'text-bg-success': printState === 'SENT_TO_PRINT'}"
      [ngbTooltip]="sentToPrinterAt || printedAt ? tipContent : null"
      class="badge d-flex align-items-center gap-2"
      style="width: min-content"
    >
      <ng-container [ngSwitch]="printState">
        <span *ngSwitchCase="'QUEUED'">{{ 'HOME_ORDER_QUEUED' | tr }}</span>
        <span *ngSwitchCase="'SENT_TO_PRINT'">{{ 'HOME_ORDER_SENT_TO_PRINT' | tr }}</span>
        <span *ngSwitchCase="'PRINTED'">{{ 'HOME_ORDER_PROCESSED' | tr }}</span>
      </ng-container>
      <div class="circle pulse green" *ngIf="printState === 'QUEUED'; else sentToPrint"></div>

      <ng-template #sentToPrint>
        <i-bs name="check2-square" />
      </ng-template>
    </div>
    <ng-template #tipContent>
      <ng-container [ngSwitch]="printState">
        <span *ngSwitchCase="'SENT_TO_PRINT'">{{ sentToPrinterAt | date : 'dd.MM. HH:mm:ss' }}</span>
        <span *ngSwitchCase="'PRINTED'">{{ printedAt | date : 'dd.MM. HH:mm:ss' }}</span>
      </ng-container>
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
  imports: [NgClass, AppIconsModule, NgIf, DfxTr, NgSwitch, NgSwitchCase, DatePipe, NgbTooltip],
})
export class AppOrderProductStateBadgeComponent {
  @Input({required: true}) printState!: 'PRINTED' | 'SENT_TO_PRINT' | 'QUEUED';

  @Input() sentToPrinterAt?: string;
  @Input() printedAt?: string;
}

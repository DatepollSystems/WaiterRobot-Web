import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../../../_shared/ui/icons.module';

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
      <ng-container [ngSwitch]="!unpaidReason">
        <div *ngSwitchCase="true" class="d-flex gap-2 align-items-center">
          <i-bs name="check2-square" />
          <span>{{ 'Bezahlt' | tr }}</span>
        </div>
        <div
          *ngSwitchCase="false"
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
  @Input() unpaidReason?: string;
}

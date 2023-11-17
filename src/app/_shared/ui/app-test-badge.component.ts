import {ChangeDetectionStrategy, Component} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <span class="badge text-bg-warning d-flex align-items-center gap-2" [ngbTooltip]="'HOME_ORDER_TEST_DESCRIPTION' | tr">
      {{ 'HOME_ORDER_TEST' | tr }}
      <bi name="terminal-fill" />
    </span>
  `,
  standalone: true,
  selector: 'app-test-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, DfxTr, NgbTooltip],
})
export class AppTestBadge {}

import {ChangeDetectionStrategy, Component} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <span class="badge text-bg-warning d-flex align-items-center gap-2" [ngbTooltip]="'HOME_ORDER_TEST_DESCRIPTION' | transloco">
      {{ 'HOME_ORDER_TEST' | transloco }}
      <bi name="terminal-fill" />
    </span>
  `,
  standalone: true,
  selector: 'app-test-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, TranslocoPipe, NgbTooltip],
})
export class AppTestBadge {}

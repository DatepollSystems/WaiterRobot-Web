import {ChangeDetectionStrategy, Component} from '@angular/core';

import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <h1>{{ 'HOME_BILL_UNPAID_REASON' | tr }}</h1>
    <p>TBD</p>
  `,
  selector: 'app-all-unpaid-reasons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr],
})
export class AllUnpaidReasonsComponent {}

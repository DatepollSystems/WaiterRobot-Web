import {Component} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxHideIfOnline} from 'dfx-helper';

@Component({
  template: `
    <div class="alert alert-warning" role="alert" hideIfOnline>
      <bi name="wifi-off" />
      {{ 'OFFLINE' | transloco }}
    </div>
  `,
  standalone: true,
  selector: 'app-network-offline-warning',
  imports: [DfxHideIfOnline, TranslocoPipe, BiComponent],
})
export class NetworkOfflineWarningComponent {}

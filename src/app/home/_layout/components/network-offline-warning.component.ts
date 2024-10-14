import {Component} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
      <bi name="wifi-off" />
      {{ 'OFFLINE' | transloco }}
    </div>
  `,
  standalone: true,
  selector: 'app-network-offline-warning',
  imports: [TranslocoPipe, BiComponent],
})
export class NetworkOfflineWarningComponent {}

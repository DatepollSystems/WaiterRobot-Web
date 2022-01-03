import {Component, Input} from '@angular/core';

import {WaiterModel} from '../../_models/waiter.model';
import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-waiter-qrcode-modal',
  template: `
    <app-qrcode-modal [data]="token">
      <h4 class="modal-title" id="modal-qrcode-title">{{ 'HOME_WAITERS_SHOW_QR_CODE' | tr }} "{{ name }}"</h4>
    </app-qrcode-modal>
  `,
})
export class WaiterQRCodeModalComponent {
  @Input() token: string = '';
  @Input() name: string = '';
}

import {Component, Input} from '@angular/core';

import {WaiterModel} from '../../_models/waiter.model';
import {EventModel} from '../../_models/event.model';

@Component({
  selector: 'app-waiter-qrcode-modal',
  template: `
    <app-qrcode-modal [data]="token">
      <h4 class="modal-title" id="modal-qrcode-title" header>{{ 'HOME_WAITERS_SHOW_QR_CODE' | tr }} "{{ name }}"</h4>
      <div body fxLayout="row" fxLayoutAlign="center" *ngIf="body.length > 0">
        <div class="card text-dark bg-light mb-3" fxFlex.gt-sm="50%">
          <div class="card-body">
            <h5 class="card-title">{{ 'INFORMATION' | tr }}</h5>
            <p class="card-text">{{ body | tr }}</p>
          </div>
        </div>
      </div>
    </app-qrcode-modal>
  `,
})
export class WaiterQRCodeModalComponent {
  @Input() token: string = '';
  @Input() name: string = '';
  @Input() body: string = '';
}

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {WaitersService} from '../../../_services/waiters.service';

import {WaiterModel} from '../../../_models/waiter.model';
import {WaiterQRCodeModal} from '../waiter-qr-code-modal.component';

@Component({
  selector: 'app-waiter-edit',
  templateUrl: './waiter-edit.component.html',
  styleUrls: ['./waiter-edit.component.scss'],
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2];

  constructor(route: ActivatedRoute, router: Router, waitersService: WaitersService, modal: NgbModal) {
    super(route, router, waitersService, modal);
  }

  onShowQRCode(waiter: WaiterModel) {
    if (this.modal == null) {
      return;
    }
    const modalRef = this.modal.open(WaiterQRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }
}

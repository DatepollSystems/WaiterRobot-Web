import {Component, inject} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {SwitcherPage} from '../../../pages/home/switcher.page';

@Component({
  template: `
    <div class="modal-header p-5 pb-0 border-bottom-0">
      <h1 class="fw-bold mb-0 fs-2" id="modal-switcher-title">Wähle Organisation und Event aus</h1>
      <button class="btn-close" (mousedown)="activeModal.dismiss()" type="button" aria-label="Close"></button>
    </div>
    <div class="modal-body p-5">
      <switcher-page [modal]="activeModal" />
    </div>
  `,
  selector: 'app-switcher-modal',
  imports: [SwitcherPage],
})
export class SwitcherModal {
  activeModal = inject(NgbActiveModal);
}

import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-not-activated-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'INFORMATION' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <strong>{{ 'ABOUT_SIGNIN_FAILED_ACCOUNT_NOT_ACTIVATED' | tr }}</strong>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
})
export class AppAccountNotActivatedDialog {
  constructor(public activeModal: NgbActiveModal) {}
}

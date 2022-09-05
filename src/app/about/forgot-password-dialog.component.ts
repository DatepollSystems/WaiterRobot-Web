import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'INFORMATION' | tr }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <strong>{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD' | tr }}</strong>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
})
export class AppForgotPasswordDialog {
  constructor(public activeModal: NgbActiveModal) {}
}

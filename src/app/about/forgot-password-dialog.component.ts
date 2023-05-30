import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'INFORMATION' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <strong
        >{{ 'ABOUT_SIGNIN_FORGOT_PASSWORD' | tr }} <a href="mailto:hallo@kellner.team" target="_blank" rel="noopener">hallo@kellner.team</a>
      </strong>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  selector: 'app-forgot-password-modal',
  imports: [DfxTr],
  standalone: true,
})
export class AppForgotPasswordDialog {
  constructor(public activeModal: NgbActiveModal) {}
}

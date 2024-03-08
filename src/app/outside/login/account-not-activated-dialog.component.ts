import {Component, inject} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {TranslocoPipe} from '@ngneat/transloco';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'INFORMATION' | transloco }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <strong>{{ 'ABOUT_SIGNIN_FAILED_ACCOUNT_NOT_ACTIVATED' | transloco }}</strong>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
    </div>
  `,
  selector: 'app-account-not-activated-modal',
  standalone: true,
  imports: [TranslocoPipe],
})
export class AppAccountNotActivatedDialog {
  activeModal = inject(NgbActiveModal);
}

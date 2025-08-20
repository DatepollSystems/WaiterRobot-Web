import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-gdpr-confirmation">
        {{ 'HOME_ORGS_SETTINGS_GDPR_CONTRACT' | transloco }} - {{ contractDate() | date: 'dd.MM.yyyy' }}
      </h4>
      <button class="btn-close btn-close-white" (mousedown)="activeModal.close(undefined)" type="button" aria-label="Close"></button>
    </div>
    @if (pdf(); as pdf) {
      <div style="height: 80vh; width: 100%">
        <ng2-pdfjs-viewer [pdfSrc]="pdf" [viewBookmark]="false" />
      </div>
    }
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" (mousedown)="activeModal.close(undefined)" type="button">
        {{ 'CLOSE' | transloco }}
      </button>
      @if (confirm()) {
        <button class="btn btn-success" (mousedown)="activeModal.close(true)" type="submit">
          {{ 'CONFIRM' | transloco }}
        </button>
      }
    </div>
  `,
  selector: 'wr-gdpr-confirmation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, PdfJsViewerModule, DatePipe],
})
export class GDPRConfirmationModal {
  activeModal = inject(NgbActiveModal);

  confirm = signal(true);
  contractDate = signal(new Date());

  pdf = signal<Uint8Array | undefined>(undefined);
}

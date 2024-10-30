import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject, viewChild} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {injectTable} from '@home-shared/list';
import {base64ToFileAndDownload} from '@home-shared/services/file.utils';

import {SelectedOrganisationService} from '@shared/services';
import {AppProgressBarComponent} from '@shared/ui/loading';

import {PrinterBatchUpdateDto} from '../../printers/printers-batch-update.modal';
import {GDPRStore} from '../_services/gdpr.store';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_SETTINGS_GDPR' | transloco }}</h1>

      <div>
        <button class="btn btn-success" (click)="gdprStore.newAgreement()">Neuer Auftragsverarbeitungsvertrag</button>
      </div>

      <div class="table-responsive">
        <table [hover]="true" [dataSource]="table.dataSource()" ngb-table ngb-sort>
          <ng-container ngbColumnDef="agreedAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Agreed at' | transloco }}</th>
            <td *ngbCellDef="let agreement" ngb-cell>{{ agreement.agreedOnAt | date: 'YYYY.MM.dd HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="agreedBy">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'Agreed By' | transloco }}</th>
            <td *ngbCellDef="let agreement" ngb-cell>{{ agreement.agreedOnBy }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="table.columnsToDisplay()" ngb-header-row></tr>
          <tr *ngbRowDef="let agreement; columns: table.columnsToDisplay()" (mousedown)="gdprStore.load(agreement.id)" ngb-row></tr>
        </table>
      </div>

      <app-progress-bar [show]="gdprStore.isLoading()" />
    </div>
  `,
  selector: 'wr-gdpr-list',
  standalone: true,
  imports: [TranslocoPipe, DfxSortModule, DfxTableModule, AppProgressBarComponent, DatePipe],
})
export class GDPRList {
  gdprStore = inject(GDPRStore);
  #modal = inject(NgbModal);
  #selectedOrganisationId$ = inject(SelectedOrganisationService).selectedIdNotNull$;

  sort = viewChild(NgbSort);

  table = injectTable({
    columnsToDisplay: ['agreedAt', 'agreedBy'],
    data: this.gdprStore.agreements,
    sort: this.sort,
  });

  constructor() {
    this.gdprStore.loadAll(this.#selectedOrganisationId$);

    effect(() => {
      const fileDto = this.gdprStore.fileDto();
      if (fileDto) {
        console.log('New gdpr file', fileDto);

        void base64ToFileAndDownload(fileDto.data, 'gdpr.pdf');

        this.openGDPRConfirmModal();
      }
    });
  }

  openGDPRConfirmModal() {
    const modalRef = this.#modal.open(GDPRConfirmationModal, {
      ariaLabelledBy: 'modal-gdpr-confirmation',
      size: 'lg',
    });

    void modalRef.result
      .then((result?: PrinterBatchUpdateDto) => {
        if (result) {
          this.gdprStore.confirm();
        }
      })
      .catch();
  }
}

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-gdpr-confirmation">Confirm</h4>
      <button class="btn-close btn-close-white" (mousedown)="activeModal.close(undefined)" type="button" aria-label="Close"></button>
    </div>
    <div class="modal-body"></div>
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" (mousedown)="activeModal.close(undefined)" type="button">
        {{ 'CLOSE' | transloco }}
      </button>
      <button class="btn btn-success" (mousedown)="activeModal.close(true)" type="submit">
        {{ 'CONFIRM' | transloco }}
      </button>
    </div>
  `,
  selector: 'wr-gdpr-confirmation-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
})
class GDPRConfirmationModal {
  activeModal = inject(NgbActiveModal);
}

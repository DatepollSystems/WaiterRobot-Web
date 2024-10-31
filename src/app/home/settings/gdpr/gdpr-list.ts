import {DatePipe} from '@angular/common';
import {Component, effect, inject, viewChild} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {injectTable} from '@home-shared/list';
import {base64ToArrayBuffer} from '@home-shared/services/file.utils';

import {SelectedOrganisationService} from '@shared/services';
import {AppProgressBarComponent} from '@shared/ui/loading';

import {PrinterBatchUpdateDto} from '../../printers/printers-batch-update.modal';
import {GDPRStore} from '../_services/gdpr.store';
import {GDPRConfirmationModal} from './gdpr-confirmation-modal';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_SETTINGS_GDPR' | transloco }}</h1>

      <div>
        <button class="btn btn-success" (click)="gdprStore.newAgreement()">{{ 'HOME_ORGS_SETTINGS_NEW_GDPR_CONTRACT' | transloco }}</button>
      </div>

      <div class="table-responsive">
        <table [hover]="true" [dataSource]="table.dataSource()" ngb-table ngb-sort>
          <ng-container ngbColumnDef="agreedAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_SETTINGS_GDPR_AGREED_AT' | transloco }}</th>
            <td *ngbCellDef="let agreement" ngb-cell>{{ agreement.agreedOnAt | date: 'dd.MM.YYYY HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="agreedBy">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_SETTINGS_GDPR_AGREED_BY' | transloco }}</th>
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

    effect(
      () => {
        const fileDto = this.gdprStore.fileDto();
        if (fileDto) {
          console.log('New gdpr file', fileDto);

          this.openGDPRConfirmModal(base64ToArrayBuffer(fileDto.data));
        }
      },
      {allowSignalWrites: true},
    );
  }

  openGDPRConfirmModal(pdf: Uint8Array) {
    const modalRef = this.#modal.open(GDPRConfirmationModal, {
      ariaLabelledBy: 'modal-gdpr-confirmation',
      size: 'lg',
    });

    (modalRef.componentInstance as GDPRConfirmationModal).pdf.set(pdf);

    void modalRef.result
      .then((result?: PrinterBatchUpdateDto) => {
        if (result) {
          void this.gdprStore.confirm();
        } else {
          this.gdprStore.reset();
        }
      })
      .catch(() => this.gdprStore.reset());
  }
}

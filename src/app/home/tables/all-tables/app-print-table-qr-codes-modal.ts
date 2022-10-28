import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxPrintDirective} from 'dfx-helper';
import {QRCodeModule} from 'angularx-qrcode';
import {NgForOf} from '@angular/common';
import {DfxTranslateModule} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {IconsModule} from '../../../_shared/ui/icons.module';
import {TableModel} from '../_models/table.model';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="app-tables-qr-codes-title">{{ 'QRCODE' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <btn-toolbar>
        <div>
          <button
            class="btn btn-sm btn-primary"
            printSectionId="qrcode-print-section"
            print
            [styleSheetFiles]="['/assets/styles/bootstrap-grid.min.css']"
            [printStyle]="{
              '.qr-code': {padding: getQrCodePadding() + 'px', 'border-style': 'dashed', 'border-color': '#ccc', 'border-width': '1px'}
            }"
            [printTitle]="'print'">
            <i-bs name="printer"></i-bs>
            {{ 'PRINT' | tr }}
          </button>
        </div>

        <div ngbDropdown class="d-inline-block">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="qrCodeSizeDropdown" ngbDropdownToggle>
            Size: {{ qrCodeSize }}
          </button>
          <div ngbDropdownMenu aria-labelledby="qrCodeSizeDropdown">
            <button ngbDropdownItem (click)="qrCodeSize = 'SM'">Small</button>
            <button ngbDropdownItem (click)="qrCodeSize = 'MD'">Middle</button>
            <button ngbDropdownItem (click)="qrCodeSize = 'LG'">Large</button>
          </div>
        </div>
      </btn-toolbar>

      <div id="qrcode-print-section" class="main">
        <div class="d-flex flex-wrap">
          <div *ngFor="let mytable of tables" class="qr-code" [style.padding]="getQrCodePadding() + 'px'">
            <qrcode [width]="getQrCodeSize()" errorCorrectionLevel="M" [margin]="0" [qrdata]="parser(mytable)" elementType="img"></qrcode>

            <span class="text-black">Table: {{ mytable.tableNumber }}</span>
            <br />
            <span class="text-black">Tablegroup: {{ mytable.groupName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  styles: [
    `
      .main {
        background-color: #ffffff;
      }

      .qr-code {
        border-style: dashed;
        border-color: #ccc;
        border-width: 1px;
      }
    `,
  ],
  selector: 'app-print-table-qr-codes-modal',
  standalone: true,
  imports: [DfxPrintDirective, QRCodeModule, NgForOf, DfxTranslateModule, AppBtnToolbarComponent, IconsModule, NgbDropdownModule],
})
export class AppPrintTableQrCodesModalComponent {
  @Input() tables?: TableModel[];

  qrCodeSize: 'SM' | 'MD' | 'LG' = 'MD';

  constructor(public activeModal: NgbActiveModal) {}

  parser = (table: TableModel): string => {
    return JSON.stringify({id: table.tableNumber, groupId: table.groupId});
  };

  getQrCodeSize = () => {
    switch (this.qrCodeSize) {
      case 'SM':
        return 100;
      case 'MD':
        return 200;
      case 'LG':
        return 300;
      default:
        throw Error('Uknown qr code size');
    }
  };

  getQrCodePadding = () => {
    switch (this.qrCodeSize) {
      case 'SM':
        return 10;
      case 'MD':
        return 15;
      case 'LG':
        return 50;
      default:
        throw Error('Uknown qr code size');
    }
  };
}

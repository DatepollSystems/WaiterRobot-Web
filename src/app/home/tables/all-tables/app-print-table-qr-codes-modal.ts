import {NgForOf} from '@angular/common';
import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {DfxPrintDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
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

        <div>
          <button class="btn btn-sm btn-primary" (click)="pdf()">
            <i-bs name="printer"></i-bs>
            {{ 'PDF' | tr }}
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

      <div id="htmlData" class="main">
        <div class="d-flex flex-wrap justify-content-center">
          <div *ngFor="let mytable of tables" class="qr-code" [style.padding]="getQrCodePadding() + 'px'">
            <qrcode
              [width]="getQrCodeSize()"
              errorCorrectionLevel="M"
              [margin]="0"
              [qrdata]="parser(mytable)"
              elementType="canvas"></qrcode>

            <div class="text-center">
              <span class="text-black"
                >Tisch: <b>{{ mytable.tableNumber }}</b></span
              >
              <br />
              <span class="text-black"
                >Gruppe: <b>{{ mytable.groupName }}</b></span
              >
            </div>
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

  qrCodeSize: 'SM' | 'MD' | 'LG' = 'SM';

  constructor(public activeModal: NgbActiveModal) {}

  parser = (table: TableModel): string => {
    return JSON.stringify({id: table.tableNumber, groupId: table.groupId});
  };

  pdf(): void {
    let DATA: any = document.getElementById('htmlData');
    // html2canvas(DATA, {scale: 1.5}).then((canvas) => {
    //   let fileWidth = 208;
    //   let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //   const FILEURI = canvas.toDataURL('image/png');
    //   let PDF = new jsPDF('p', 'mm', 'a4');
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //   PDF.save('angular-demo.pdf');
    // });

    // html2canvas(DATA, {scale: 1.5}).then(canvas => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const imgWidth = this.getQrCodeSize();
    //   const pageHeight = 260;
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;
    //   const doc = new jsPDF('p', 'mm');
    //   let position = 0;
    //   doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;
    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     doc.addPage();
    //     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }
    //   doc.save('download.pdf');
    // });

    html2canvas(DATA, {}).then((canvas) => {
      //! MAKE YOUR PDF
      const pdf = new jsPDF('p', 'pt', 'letter');

      const downCalc = 1157;

      for (let i = 0; i <= DATA.clientHeight / downCalc; i++) {
        //! This is all just html2canvas stuff
        let srcImg = canvas;
        let sX = 0;
        let sY = downCalc * i; // start 980 pixels down for every new page
        let sWidth = 900;
        let sHeight = downCalc;
        let dX = 0;
        let dY = 0;
        let dWidth = 900;
        let dHeight = downCalc;

        const onePageCanvas = document.createElement('canvas');
        onePageCanvas.setAttribute('width', '900px');
        onePageCanvas.setAttribute('height', `${downCalc}px`);
        let ctx = onePageCanvas.getContext('2d');
        // details on this usage of this function:
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
        ctx?.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

        // document.body.appendChild(canvas);
        let canvasDataURL = onePageCanvas.toDataURL('image/png', 1);

        let width = onePageCanvas.width;
        let height = onePageCanvas.clientHeight;

        //! If we're on anything other than the first page,
        // add another page
        if (i > 0) {
          pdf.addPage([612, 791]); //8.5" x 11" in pts (in*72)
        }
        //! now we declare that we're working on that page
        pdf.setPage(i + 1);
        //! now we add content to that page!
        pdf.addImage(canvasDataURL, 'PNG', 0, 0, width * 0.62, height * 0.62);
      }
      //! after the for loop is finished running, we save the pdf.
      pdf.save('test.pdf');
    });
  }

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
        return 15;
      case 'MD':
        return 15;
      case 'LG':
        return 20;
      default:
        throw Error('Uknown qr code size');
    }
  };
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppQrCodeViewComponent} from './app-qr-code-view.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {QRCodeModule} from 'angularx-qrcode';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

const routes: Routes = [{path: 'view', component: AppQrCodeViewComponent}];

@NgModule({
  declarations: [AppQrCodeViewComponent],
  exports: [AppQrCodeViewComponent],
  imports: [RouterModule.forChild(routes), CommonModule, QRCodeModule, FlexLayoutModule, NgbTooltipModule, DfxTranslateModule],
})
export class AppQrCodeViewModule {}

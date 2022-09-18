import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeViewComponent} from './app-qr-code-view.component';

const routes: Routes = [{path: 'view', component: AppQrCodeViewComponent}];

@NgModule({
  declarations: [AppQrCodeViewComponent],
  exports: [AppQrCodeViewComponent],
  imports: [RouterModule.forChild(routes), CommonModule, QRCodeModule, FlexLayoutModule, NgbTooltipModule, DfxTranslateModule],
})
export class AppQrCodeViewModule {}

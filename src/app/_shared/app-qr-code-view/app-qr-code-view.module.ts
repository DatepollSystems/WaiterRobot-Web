import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppQrCodeViewComponent} from './app-qr-code-view.component';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import {FlexLayoutModule} from '@angular/flex-layout';

const routes: Routes = [{path: 'view', component: AppQrCodeViewComponent}];

@NgModule({
  declarations: [AppQrCodeViewComponent],
  exports: [AppQrCodeViewComponent],
  imports: [RouterModule.forChild(routes), CommonModule, NgxQRCodeModule, FlexLayoutModule],
})
export class AppQrCodeViewModule {}

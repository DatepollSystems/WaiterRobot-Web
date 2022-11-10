import {NgModule} from '@angular/core';
import {AppBtnQrCodeComponent} from './app-btn-qr-code.component';
import {AppBtnQrCodeContentDirective} from './app-btn-qr-code-content.directive';
import {CopyDirective} from '../copy.directive';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';
import {AppIconsModule} from '../icons.module';
import {NgTemplateOutlet} from '@angular/common';
import {DfxCutPipe} from 'dfx-helper';

@NgModule({
  imports: [CopyDirective, NgbTooltipModule, DfxTranslateModule, AppIconsModule, NgbPopoverModule, NgTemplateOutlet, DfxCutPipe],
  declarations: [AppBtnQrCodeComponent, AppBtnQrCodeContentDirective],
  exports: [AppBtnQrCodeComponent, AppBtnQrCodeContentDirective],
})
export class AppBtnQrCodeModule {}

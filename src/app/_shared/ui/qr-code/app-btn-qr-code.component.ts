import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxCutPipe} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {QrCodeService} from '../../services/qr-code.service';
import {CopyDirective} from '../copy.directive';
import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <ng-template #popContent>
      <p>{{ info | tr }}</p>
      <a [href]="data" target="_blank" rel="noopener">{{ data | s_cut: 43 : '..' }}</a>
    </ng-template>
    <ng-template #popTitle>
      <b>{{ text | tr }}</b>
    </ng-template>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
      <button
        (click)="openQrCode()"
        type="button"
        class="btn btn-sm btn-primary pe-2"
        [ngbPopover]="popContent"
        [popoverTitle]="popTitle"
        [autoClose]="'outside'"
        placement="bottom"
        container="body"
        triggers="mouseenter"
      >
        <i-bs name="qr-code" class="me-1" />
        {{ text | tr }}
      </button>
      <button
        class="btn btn-primary btn-sm"
        (click)="c.copy(t)"
        [copyable]="data"
        #c="copy"
        aria-label="Copy link"
        ngbTooltip="{{ 'COPIED' | tr }}"
        #t="ngbTooltip"
        autoClose="false"
        triggers="manual"
        placement="right"
      >
        <i-bs name="clipboard" aria-label="Copy content to clipboard" />
      </button>
    </div>
  `,
  standalone: true,
  imports: [CopyDirective, NgbTooltipModule, DfxTranslateModule, AppIconsModule, NgbPopoverModule, DfxCutPipe],
  selector: 'app-btn-qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBtnQrCodeComponent {
  @Input() data?: string;

  @Input() text = '';
  @Input() info = '';

  constructor(private qrCodeService: QrCodeService) {}

  openQrCode(): void {
    this.qrCodeService.openQRCodePage({data: this.data ?? 'ERROR', text: this.text, info: this.info});
  }
}

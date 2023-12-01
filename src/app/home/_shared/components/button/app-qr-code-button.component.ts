import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {CopyDirective} from '../../../../_shared/ui/copy.directive';
import {QrCodeService} from '../../services/qr-code.service';

@Component({
  template: `
    <ng-template #popContent>
      <p>{{ info | tr }}</p>
      <a [href]="data" target="_blank" rel="noopener">{{ data | s_cut: 82 : '...' }}</a>
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
        <bi name="qr-code" class="me-1" />
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
        <bi name="clipboard" aria-label="Copy content to clipboard" />
      </button>
    </div>
  `,
  standalone: true,
  imports: [CopyDirective, NgbTooltipModule, DfxTranslateModule, BiComponent, NgbPopoverModule, DfxCutPipe],
  selector: 'app-qrcode-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppQrCodeButtonComponent {
  @Input() data?: string;

  @Input() text = '';
  @Input() info = '';

  constructor(private qrCodeService: QrCodeService) {}

  openQrCode(): void {
    this.qrCodeService.openQRCodePage({data: this.data ?? 'ERROR', text: this.text, info: this.info});
  }
}
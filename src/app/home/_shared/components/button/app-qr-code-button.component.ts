import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';

import {CopyDirective} from '@shared/ui/copy.directive';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';
import {QrCodeService} from '../../services/qr-code.service';

@Component({
  template: `
    <ng-template #popContent>
      <p>{{ info | transloco }}</p>
      <a target="_blank" rel="noreferrer" [href]="data">{{ data | s_cut: 82 : '...' }}</a>
    </ng-template>
    <ng-template #popTitle>
      <b>{{ text | transloco }}</b>
    </ng-template>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
      <button
        type="button"
        class="btn btn-sm btn-primary pe-2"
        placement="bottom"
        container="body"
        triggers="mouseenter"
        [ngbPopover]="popContent"
        [popoverTitle]="popTitle"
        [autoClose]="'outside'"
        (mousedown)="openQrCode()"
      >
        <bi name="qr-code" class="me-1" />
        {{ text | transloco }}
      </button>
      <button
        #c="copy"
        #t="ngbTooltip"
        type="button"
        class="btn btn-primary btn-sm"
        aria-label="Copy link"
        autoClose="false"
        triggers="manual"
        placement="right"
        [copyable]="data"
        [ngbTooltip]="'COPIED' | transloco"
        (mousedown)="c.copy(t)"
      >
        <bi name="clipboard" aria-label="Copy content to clipboard" />
      </button>
    </div>
  `,
  standalone: true,
  imports: [CopyDirective, NgbTooltipModule, BiComponent, NgbPopoverModule, DfxCutPipe, TranslocoPipe],
  selector: 'app-qrcode-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppQrCodeButtonComponent {
  #qrCodeService = inject(QrCodeService);

  @Input() data?: string;

  @Input() text = '';
  @Input() info = '';

  openQrCode(): void {
    this.#qrCodeService.openQRCodePage({data: this.data ?? 'ERROR', text: this.text, info: this.info});
  }
}

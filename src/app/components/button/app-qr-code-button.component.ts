import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe} from 'dfx-helper';

import {QrCodeService} from '../../services/qr-code.service';
import {CopyDirective} from '../copy.directive';

@Component({
  template: `
    <ng-template #popContent>
      <p>{{ info() | transloco }}</p>
      <a [href]="data()" target="_blank" rel="noreferrer">{{ data() | s_cut: 82 : '...' }}</a>
    </ng-template>
    <ng-template #popTitle>
      <b>{{ text() | transloco }}</b>
    </ng-template>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
      <button
        class="btn btn-sm btn-primary pe-2"
        [ngbPopover]="popContent"
        [popoverTitle]="popTitle"
        [autoClose]="'outside'"
        (mousedown)="openQrCode()"
        type="button"
        placement="bottom"
        container="body"
        triggers="mouseenter"
      >
        <bi class="me-1" name="qr-code" />
        {{ text() | transloco }}
      </button>
      <button
        class="btn btn-primary btn-sm"
        #c="copy"
        #t="ngbTooltip"
        [copyable]="data()"
        [ngbTooltip]="'COPIED' | transloco"
        (mousedown)="c.copy(t)"
        type="button"
        aria-label="Copy link"
        autoClose="false"
        triggers="manual"
        placement="right"
      >
        <bi name="clipboard" aria-label="Copy content to clipboard" />
      </button>
    </div>
  `,
  imports: [CopyDirective, NgbTooltipModule, BiComponent, NgbPopoverModule, DfxCutPipe, TranslocoPipe],
  selector: 'app-qrcode-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppQrCodeButtonComponent {
  #qrCodeService = inject(QrCodeService);

  data = input<string>();

  text = input('');
  info = input('');

  openQrCode(): void {
    this.#qrCodeService.openQRCodePage({
      data: this.data() ?? 'ERROR',
      text: this.text(),
      info: this.info(),
    });
  }
}

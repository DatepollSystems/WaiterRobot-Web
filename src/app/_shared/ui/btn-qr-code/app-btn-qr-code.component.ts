import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {AppBtnQrCodeContentDirective} from './app-btn-qr-code-content.directive';

@Component({
  template: `
    <ng-template #popContent>
      <ng-content select="[info]"></ng-content>
      <br /><br />
      <a [href]="data" target="_blank" rel="noopener">{{ data | cut: 43:'..' }}</a>
    </ng-template>
    <ng-template #popTitle>
      <b><ng-container *ngTemplateOutlet="contentTemplate"></ng-container></b>
    </ng-template>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        [ngbPopover]="popContent"
        [popoverTitle]="popTitle"
        [autoClose]="'outside'"
        placement="bottom"
        container="body"
        triggers="mouseenter">
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </button>
      <button
        class="btn btn-primary btn-sm"
        (click)="c.copy(t)"
        [copyable]="data"
        #c="copy"
        ngbTooltip="{{ 'COPIED' | tr }}"
        #t="ngbTooltip"
        autoClose="false"
        triggers="manual"
        placement="right">
        <i-bs name="clipboard" aria-label="Copy content to clipboard"></i-bs>
      </button>
    </div>
  `,
  selector: 'app-btn-qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBtnQrCodeComponent {
  @Input() class?: string;

  @Input() data?: string;

  @ContentChild(AppBtnQrCodeContentDirective, {read: TemplateRef}) contentTemplate!: TemplateRef<AppBtnQrCodeContentDirective>;
}

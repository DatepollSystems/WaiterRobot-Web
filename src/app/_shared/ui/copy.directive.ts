import {Directive, Input} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper} from 'dfx-helper';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'button[copyable]',
  exportAs: 'copy',
  standalone: true,
})
export class CopyDirective {
  @Input() copyable?: string;

  copy(t: NgbTooltip): void {
    if (this.copyable) {
      t.open();
      ClipboardHelper.copy(this.copyable);
      setTimeout(() => {
        t.close();
      }, 1000);
    }
  }
}

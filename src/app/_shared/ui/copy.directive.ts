import {Directive, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {cl_copy} from 'dfts-helper';

@Directive({
  selector: 'button[copyable]',
  exportAs: 'copy',
  standalone: true,
})
export class CopyDirective {
  @Input() copyable?: string;

  copy(t: NgbTooltip): void {
    if (this.copyable) {
      t.open();
      cl_copy(this.copyable);
      setTimeout(() => {
        t.close();
      }, 1000);
    }
  }
}

import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  template: `
    <div class="pb-3 pt-1">
      <div class="d-flex flex-wrap gap-3 gap-md-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  selector: 'btn-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBtnToolbarComponent {}

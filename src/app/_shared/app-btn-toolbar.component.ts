import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'btn-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-3 pt-1">
      <div class="d-flex flex-wrap gap-3 gap-md-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [],
})
export class AppBtnToolbarComponent {}

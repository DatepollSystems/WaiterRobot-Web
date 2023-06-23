import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div>
      <button class="btn btn-sm btn-dark text-white" (click)="location.back()">{{ 'GO_BACK' | tr }}</button>
    </div>
  `,
  selector: 'back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr],
})
export class AppBackButtonComponent {
  location = inject(Location);
}

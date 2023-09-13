import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

@Component({
  template: ' <div *ngIf="color" class="indicator" [style.background-color]="color" ngbTooltip="Farbindikator"></div>',
  styles: [
    `
      .indicator {
        height: 20px;
        width: 20px;
        border-radius: 50%;
      }
    `,
  ],
  standalone: true,
  selector: 'app-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, DfxTr, NgbTooltip],
})
export class AppColorIndicatorComponent {
  @Input({required: true}) color?: string | null;
}

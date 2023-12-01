import {NgStyle} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

@Component({
  template: ` <div
    [ngStyle]="{width: size + 'px', height: size + 'px', backgroundColor: color, borderRadius: '50px'}"
    [ngbTooltip]="'COLOR_INDICATOR' | tr"
  ></div>`,
  standalone: true,
  selector: 'app-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, NgbTooltip, NgStyle],
})
export class AppColorIndicatorComponent {
  @Input({required: true}) color!: string;

  @Input() size = 20;
}

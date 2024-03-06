import {Component} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent, provideBi, withHeight, withWidth} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  selector: 'app-blur-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn mt-1"
      [ngbTooltip]="'Vertrauliche Daten anzeigen/verstecken' | tr"
      (click)="blurSetting.setBlur(!blurSetting.isBlurred())"
    >
      @if (blurSetting.isBlurred()) {
        <bi name="eye-slash" />
      } @else {
        <bi name="eye" />
      }
    </button>
  `,
  imports: [BiComponent, NgbTooltip, DfxTr],
  providers: [provideBi(withHeight('24'), withWidth('24'))],
})
export class BlurToggleComponent {
  blurSetting = injectBlurSetting();
}

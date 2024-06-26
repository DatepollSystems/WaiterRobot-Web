import {Component} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent, provideBi, withSize} from 'dfx-bootstrap-icons';

@Component({
  selector: 'app-blur-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn mt-1 d-inline-flex align-items-center justify-content-between"
      triggers="hover"
      [ngbTooltip]="'HOME_BILL_BLUR_TOGGLE_DESCRIPTION' | transloco"
      (click)="blurSetting.setBlur(!blurSetting.isBlurred())"
    >
      @if (blurSetting.isBlurred()) {
        <bi name="eye-slash" />
      } @else {
        <bi name="eye" />
      }
    </button>
  `,
  imports: [BiComponent, NgbTooltip, TranslocoPipe],
  providers: [provideBi(withSize('24'))],
})
export class BlurToggleComponent {
  blurSetting = injectBlurSetting();
}

import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';

import {EnvironmentHelper} from '../EnvironmentHelper';

@Component({
  template: `
    <div id="brand" class="d-flex gap-2 align-items-center">
      <img alt="kellner.team logo" [ngSrc]="logoUrl" priority="true" height="110" width="110" />

      <div class="d-flex fs-1" style=" font-family: LogoFont,serif">
        <span style="color: #1b2347">kellner.</span>
        <span style="color: #fa9646;">team</span>
      </div>
    </div>
  `,
  standalone: true,
  selector: 'app-logo-with-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class AppLogoWithTextComponent {
  logoUrl = EnvironmentHelper.getLogoUrl();
}

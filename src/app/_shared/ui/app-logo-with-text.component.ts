import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EnvironmentHelper} from '../EnvironmentHelper';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-center gap-3">
      <img alt="kellner.team logo" [ngSrc]="logoUrl" priority height="110" width="110" />
      <h1 id="brand-text" [class]="month === 5 ? 'rainbow-text' : 'text-white'">kellner.team</h1>
    </div>
  `,
  styles: [
    `
      #brand-text {
        vertical-align: middle;
        padding-top: 10px;
        align-self: center;
      }

      .rainbow-text {
        background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
        color: transparent;
        background-clip: text;
        /* Fuck you chrome! https://caniuse.com/?search=background-clip%3A%20webkit */
        -webkit-background-clip: text;
      }
    `,
  ],
  standalone: true,
  selector: 'app-logo-with-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class AppLogoWithTextComponent {
  month = new Date().getMonth();

  logoUrl = EnvironmentHelper.getLogoUrl();
}

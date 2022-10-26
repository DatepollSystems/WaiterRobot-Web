import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  template: `
    <div class="d-flex align-items-center justify-content-center gap-3">
      <img alt="kellner.team logo" src="../../../assets/logo.svg" height="110" width="110" />
      <h1 id="brand">kellner.team</h1>
    </div>
  `,
  styles: [
    `
      #brand {
        vertical-align: middle;
        padding-top: 10px;
        align-self: center;
      }
    `,
  ],
  standalone: true,
  selector: 'app-logo-with-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoWithTextComponent {}

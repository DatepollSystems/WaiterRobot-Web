import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

@Component({
  standalone: true,
  imports: [CommonModule, FlexLayoutModule],
  selector: 'app-logo-with-text',
  template: `
    <div fxLayout="row" fxLayoutAlign="center center">
      <div>
        <div fxLayout="row" fxLayoutGap="4.5%">
          <img alt="kellner.team logo" src="../../assets/logo.svg" height="110" width="110" />
          <h1 id="brand" fxFlexAlign="center" style="vertical-align: middle; padding-top: 10px">kellner.team</h1>
        </div>
      </div>
    </div>
  `,
})
export class AppLogoWithTextComponent {
  constructor() {}
}

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
          <img alt="WaiterRobot logo" src="../../assets/logo.png" style="height: 110px" />
          <h1 id="brand" fxFlexAlign="center" style="vertical-align: middle; padding-top: 10px">WaiterRobot</h1>
        </div>
      </div>
    </div>
  `,
})
export class AppLogoWithTextComponent {
  constructor() {}
}
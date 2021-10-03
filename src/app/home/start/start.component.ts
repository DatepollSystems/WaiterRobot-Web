import {Component, OnInit} from '@angular/core';
import {EnvironmentHelper} from '../../_helper/EnvironmentHelper';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  isProduction: boolean = true;

  constructor() {
    this.isProduction = EnvironmentHelper.getProduction();
  }
}

import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AbstractTitleStrategy} from 'dfx-helper';

@Injectable()
export class CustomTitleStrategy extends AbstractTitleStrategy {
  override titlePrefix = 'WaiterRobot - ';

  constructor(title: Title) {
    super(title);
  }
}

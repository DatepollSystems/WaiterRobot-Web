import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AbstractTitleStrategy} from 'dfx-helper';

@Injectable()
export class CustomTitleStrategy extends AbstractTitleStrategy {
  override titlePrefix = 'kellner.team';

  constructor(title: Title) {
    super(title);
  }

  override parseTitle(title: string): string {
    return title;
  }
}

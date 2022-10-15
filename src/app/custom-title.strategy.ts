import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AbstractTitleStrategy} from 'dfx-helper';
import {TranslateService} from 'dfx-translate';

@Injectable()
export class CustomTitleStrategy extends AbstractTitleStrategy {
  override titlePrefix = 'kellner.team';

  constructor(title: Title, private translator: TranslateService) {
    super(title);
  }

  override parseTitle(title: string): string {
    return this.translator.translate(title);
  }
}

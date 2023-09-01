import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';

import {first} from 'rxjs';

import {dfxTranslate$} from 'dfx-translate';

import {EnvironmentHelper} from './EnvironmentHelper';

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  titlePrefix = EnvironmentHelper.getTitlePrefix();

  translate = dfxTranslate$();

  title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (!title) {
      this.title.setTitle(this.titlePrefix);
      return;
    }
    this.translate(title)
      .pipe(first())
      .subscribe((translation) => this.title.setTitle(`${this.titlePrefix} - ${translation}`));
  }
}

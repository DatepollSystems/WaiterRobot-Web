import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {TranslocoService} from '@jsverse/transloco';

import {first} from 'rxjs';

import {EnvironmentHelper} from './EnvironmentHelper';

@Injectable({
  providedIn: 'root',
})
export class CustomTitleStrategy extends TitleStrategy {
  titlePrefix = EnvironmentHelper.getTitleSuffix();

  translocoService = inject(TranslocoService);
  title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (!title) {
      this.title.setTitle(this.titlePrefix);
      return;
    }
    this.translocoService
      .selectTranslate<string>(title)
      .pipe(first())
      .subscribe((translation) => {
        this.title.setTitle(`${translation} • ${this.titlePrefix}`);
      });
  }
}

import {inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

import {loggerOf} from 'dfts-helper';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private logger = loggerOf('RedirectService');
  private router = inject(Router);

  private redirectUrl = signal<string | undefined>(undefined);

  setRedirectUrl(it: string): void {
    this.redirectUrl.set(it);
  }

  resetRedirectUrl(): void {
    this.redirectUrl.set(undefined);
  }

  redirect(...replaces: {toReplace: string; replaceWith: string}[]): void {
    let redirectUrl = this.redirectUrl() ?? '/';
    for (const replace of replaces) {
      redirectUrl = redirectUrl?.replace(replace.toReplace, replace.replaceWith);
    }
    this.logger.log('redirect', 'Triggered', redirectUrl);
    void this.router.navigateByUrl(redirectUrl);
  }
}

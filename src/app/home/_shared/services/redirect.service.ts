import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

import {loggerOf} from 'dfts-helper';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private logger = loggerOf('RedirectService');
  private router = inject(Router);

  private _redirectUrl = signal<string | undefined>(undefined);

  redirectUrl = computed(() => this._redirectUrl());

  setRedirectUrl(it: string): void {
    this._redirectUrl.set(it);
  }

  resetRedirectUrl(): void {
    this._redirectUrl.set(undefined);
  }

  redirect(...replaces: {toReplace: string; replaceWith: string}[]): void {
    let redirectUrl = this._redirectUrl() ?? '/';
    for (const replace of replaces) {
      redirectUrl = redirectUrl.replace(replace.toReplace, replace.replaceWith);
    }
    this.logger.log('redirect', 'Triggered', redirectUrl);
    void this.router.navigateByUrl(redirectUrl);
  }
}

import {Inject, Injectable} from '@angular/core';

import {WINDOW} from './windows-provider';

@Injectable({
  providedIn: 'root',
})
export class MobileLinkService {
  constructor(@Inject(WINDOW) private window: Window) {}

  public createWaiterSignInLink(token: string): string {
    return this.createWaiterAuthLink(token) + 'SIGNIN';
  }

  public createWaiterSignInViaCreateTokenLink(token: string): string {
    return this.createWaiterAuthLink(token) + 'CREATE';
  }

  private createWaiterAuthLink(token: string): string {
    return this.createMobileLink() + 'signIn' + '?token=' + token + '&purpose=';
  }

  private createMobileLink(): string {
    return (
      this.window.location.protocol +
      '//' +
      this.window.location.hostname +
      (this.window.location.port.length > 0 ? ':' + this.window.location.port : '') +
      '/mobile-link/'
    );
  }
}

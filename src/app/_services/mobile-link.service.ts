import {Inject, Injectable} from '@angular/core';

import {WINDOW} from './windows-provider';

@Injectable({
  providedIn: 'root',
})
export class MobileLinkService {
  constructor(@Inject(WINDOW) private window: Window) {}

  public createWaiterSignInLink(token: string): string {
    return this.createWaiterAuthLink() + 'signIn?token=' + token;
  }

  public createWaiterSignInViaCreateTokenLink(token: string): string {
    return this.createWaiterAuthLink() + 'signInViaCreateToken?token=' + token;
  }

  private createWaiterAuthLink(): string {
    return this.createMobileLink() + 'signIn?purpose=';
  }

  private createMobileLink(): string {
    return this.window.location.protocol + '//' + this.window.location.hostname + ':' + this.window.location.port + '/mobile-link/';
  }
}

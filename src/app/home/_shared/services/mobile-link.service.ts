import {Injectable} from '@angular/core';

import {injectWindow} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class MobileLinkService {
  #window = injectWindow();

  public createWaiterSignInLink(token: string): string {
    return this.createWaiterAuthLink(token, 'SIGN_IN');
  }

  public createWaiterSignInViaCreateTokenLink(token: string): string {
    return this.createWaiterAuthLink(token, 'CREATE');
  }

  public createTableLink(publicTableId: string): string {
    return `${this.createShareableLink('wl')}/t/${publicTableId}`;
  }

  private createWaiterAuthLink(token: string, purpose: 'SIGN_IN' | 'CREATE'): string {
    return `${this.createShareableLink('ml')}/signIn?purpose=${purpose}&token=${token}`;
  }

  private createShareableLink(type: 'ml' | 'wl'): string {
    return this.#window
      ? `${this.#window.location.protocol}//${this.#window.location.hostname}${
          this.#window.location.port.length > 0 ? ':' + this.#window.location.port : ''
        }/${type}`
      : '';
  }
}

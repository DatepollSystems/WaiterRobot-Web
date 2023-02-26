import {Inject, Injectable} from '@angular/core';
import {WINDOW} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class MobileLinkService {
  constructor(@Inject(WINDOW) private window: Window | undefined) {}

  public createWaiterSignInLink(token: string): string {
    return `${this.createWaiterAuthLink(token)}SIGN_IN`;
  }

  public createWaiterSignInViaCreateTokenLink(token: string): string {
    return `${this.createWaiterAuthLink(token)}CREATE`;
  }

  public createTableLink(tableId: string): string {
    return `${this.createMobileLink()}t/${tableId}`;
  }

  private createWaiterAuthLink(token: string): string {
    return `${this.createMobileLink()}signIn?token=${token}&purpose=`;
  }

  private createMobileLink(): string {
    return this.window
      ? `${this.window.location.protocol}//${this.window.location.hostname}${
          this.window.location.port.length > 0 ? ':' + this.window.location.port : ''
        }/ml/`
      : '';
  }
}

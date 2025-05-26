import {Pipe, PipeTransform} from '@angular/core';

import {injectWindow} from 'dfx-helper';

@Pipe({
  name: 'shareableLink',
  standalone: true,
  pure: true,
})
export class ShareableLinkPipe implements PipeTransform {
  window = injectWindow();

  transform(type: 'ml' | 'wl'): any {
    if (!this.window) {
      return '';
    }

    return `${this.window.location.protocol}//${this.window.location.hostname}${
      this.window.location.port.length > 0 ? ':' + this.window.location.port : ''
    }/${type}`;
  }
}

@Pipe({
  name: 'waiterAuthLink',
  standalone: true,
  pure: true,
})
export class WaiterAuthLinkPipe implements PipeTransform {
  transform(shareableLink: string, purpose: 'SIGN_IN' | 'CREATE', token: string): any {
    return `${shareableLink}/signIn?purpose=${purpose}&token=${token}`;
  }
}

@Pipe({
  name: 'publicTableLink',
  standalone: true,
  pure: true,
})
export class PublicTableLinkPipe implements PipeTransform {
  transform(shareableLink: string, publicTableId: string): any {
    return `${shareableLink}/t/${publicTableId}`;
  }
}

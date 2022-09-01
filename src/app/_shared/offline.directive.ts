import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TypeHelper} from 'dfx-helper';

import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[offline]',
})
export class OfflineDirective {
  @HostBinding('class')
  get isOffline(): string {
    if (!this._isOffline) {
      return 'd-none';
    }
    return '';
  }

  private _isOffline = false;

  @HostListener('window:offline')
  setNetworkOffline(): void {
    this._isOffline = true;
    console.log(this._isOffline);
  }

  @HostListener('window:online')
  setNetworkOnline(): void {
    this._isOffline = false;
    console.log(this._isOffline);
  }
}

@NgModule({
  imports: [],
  declarations: [OfflineDirective],
  exports: [OfflineDirective],
})
export class OfflineModule {}

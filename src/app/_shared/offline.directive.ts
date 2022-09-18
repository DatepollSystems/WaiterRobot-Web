import {NgModule} from '@angular/core';

import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[offline]',
})
export class OfflineDirective {
  @HostBinding('hidden')
  get hidden(): boolean {
    return !this._isOffline;
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

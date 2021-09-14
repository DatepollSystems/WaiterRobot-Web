import {Injectable, NgZone} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsMobileService {
  private _isMobile = true;
  public isMobileChange: Subject<boolean> = new Subject<boolean>();

  constructor(private ngZone: NgZone) {
    if (window.screen.width > 992) {
      this.setIsMobile(false);
    }

    window.onresize = () => {
      this.ngZone.run(() => {
        if (window.screen.width > 992) {
          this.setIsMobile(false);
        } else {
          this.setIsMobile(true);
        }
      });
    };
  }

  public getIsMobile(): boolean {
    return this._isMobile;
  }

  private setIsMobile(isMobile: boolean) {
    this._isMobile = isMobile;
    this.isMobileChange.next(this._isMobile);
  }
}

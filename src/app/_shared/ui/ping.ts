import {catchError, distinctUntilChanged, map, of, switchMap, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input} from '@angular/core';
import {ADirective, interceptorByPass} from 'dfx-helper';
import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';

@Component({
  selector: '[hideIfPingSucceeds]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DfxHideIfPingSucceeds extends ADirective {
  @Input() url!: string;

  /**
   * Refresh time in seconds
   */
  @Input() set refreshTime(value: NumberInput) {
    this._refreshTime = coerceNumberProperty(value);
  }

  protected _refreshTime = 10;

  @HostBinding('hidden')
  get hidden(): boolean {
    return !this.isOffline;
  }

  private byPassLoggingInterceptor = interceptorByPass().logging().buildAsOptions();
  private isOffline = false;

  constructor(httpClient: HttpClient, changeDetectionRef: ChangeDetectorRef) {
    super();
    this.unsubscribe(
      timer(0, this._refreshTime * 1000)
        .pipe(
          switchMap(() =>
            httpClient.get(this.url, this.byPassLoggingInterceptor).pipe(
              map(() => false),
              catchError(() => of(true))
            )
          ),
          distinctUntilChanged()
        )
        .subscribe((isOffline) => {
          this.isOffline = isOffline;
          changeDetectionRef.markForCheck();
        })
    );
  }
}

import {AfterViewInit, Directive, HostBinding, Input, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AComponent, ByPassInterceptorBuilder} from 'dfx-helper';
import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';

@Directive({
  standalone: true,
  selector: '[hideIfPingSucceeds]',
})
export class HideIfPingSucceedsDirective implements AfterViewInit, OnDestroy {
  @Input()
  url!: string;

  /**
   * Refresh time in seconds
   */
  @Input() set refreshTime(value: NumberInput) {
    this._refreshTime = coerceNumberProperty(value);
  }

  _refreshTime = 10;

  @HostBinding('hidden')
  get hidden(): boolean {
    return !this._isOffline;
  }

  private byPassLoggingInterceptor = new ByPassInterceptorBuilder().logging().enable();
  private _isOffline = false;
  private intervalId?: number;

  constructor(private httpClient: HttpClient) {}

  getPing(): void {
    this.httpClient.get(this.url, {context: this.byPassLoggingInterceptor}).subscribe({
      next: () => {
        this._isOffline = false;
      },
      error: () => (this._isOffline = true),
    });
  }

  ngAfterViewInit(): void {
    this.getPing();

    this.intervalId = window.setInterval(() => this.getPing(), 1000 * this._refreshTime);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }
}

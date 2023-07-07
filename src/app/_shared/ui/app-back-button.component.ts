import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, Directive, HostListener, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {WINDOW} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

@Directive({
  selector: '[back]',
  standalone: true,
})
export class AppBackDirective {
  location = inject(Location);
  router = inject(Router);
  window = inject(WINDOW);

  @Input() fallbackUrl = '/';
  @Input() closeOnNoHistory = true;

  @HostListener('click')
  goBack(): void {
    if (this.window) {
      if (this.closeOnNoHistory && this.window.history.length < 2) {
        this.window?.close();
      } else {
        this.location.back();
      }
      return;
    }
    void this.router.navigateByUrl(this.fallbackUrl);
  }
}

@Component({
  template: `
    <div>
      <button class="btn btn-sm btn-dark text-white" back>{{ 'GO_BACK' | tr }}</button>
    </div>
  `,
  selector: 'back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, AppBackDirective],
})
export class AppBackButtonComponent {}

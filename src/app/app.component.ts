import {ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';

import {Subject, takeUntil} from 'rxjs';

import {EnvironmentHelper} from './_shared/EnvironmentHelper';
import {ToastsContainerComponent} from './_shared/notifications/toasts-container.component';
import {AppLogoWithTextComponent} from './outside/_shared/app-logo-with-text.component';
import {SystemInfoComponent} from './system-info.component';

@Component({
  template: `
    <div class="flex-column" #spinnerElement>
      <div class="d-flex justify-content-center" style="padding-top: 25%">
        <div class="loader"></div>
      </div>

      <app-logo-with-text hideLogo />
    </div>

    <app-system-info />

    <router-outlet />

    <app-toasts aria-live="polite" aria-atomic="true" />
  `,
  standalone: true,
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastsContainerComponent, SystemInfoComponent, RouterOutlet, AppLogoWithTextComponent],
})
export class AppComponent {
  @ViewChild('spinnerElement')
  spinnerElement!: ElementRef;

  loaded$ = new Subject<boolean>();

  private _navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.renderer.setStyle(this.spinnerElement.nativeElement, 'display', 'flex');
    }
    if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
      this.renderer.setStyle(this.spinnerElement.nativeElement, 'display', 'none');
      this.loaded$.next(true);
    }
  }

  constructor(
    router: Router,
    private renderer: Renderer2,
  ) {
    router.events.pipe(takeUntil(this.loaded$)).subscribe((event) => this._navigationInterceptor(event));

    if (EnvironmentHelper.getProduction()) {
      console.log(`
           .--.       .--.
 _  \`    \\     /    \`  _
  \`\\.===. \\.^./ .===./\`
         \\/\`"\`\\/
      ,  |     |  ,
     / \`\\|;-.-'|/\` \\
    /    |::\\  |    \\
 .-' ,-'\`|:::; |\`'-, '-.
     |   |::::\\|   |
     |   |::::;|   |
     |   \\:::://   |
     |    \`.://'   |
    .'             \`.
 _,'                 \`,_

 Hello nice fellow, debugging "compiled" Angular apps is not fun!\n
 Visit https://github.com/DatePollSystems/WaiterRobot-Web for the source code.
      `);
    }
  }
}

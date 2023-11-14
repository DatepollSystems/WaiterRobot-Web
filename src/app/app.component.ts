import {ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

import {Subject, takeUntil} from 'rxjs';

import {LoadingBarRouterModule} from '@ngx-loading-bar/router';

import {EnvironmentHelper} from './_shared/EnvironmentHelper';
import {ToastsContainerComponent} from './_shared/notifications/toasts-container.component';

@Component({
  template: `
    <ngx-loading-bar [includeSpinner]="false" color="#7599AA" />

    <div class="justify-content-center" style="margin-top: 40%;" #spinnerElement>
      <div class="loader"></div>
    </div>

    <router-outlet />

    <app-toasts aria-live="polite" aria-atomic="true" />
  `,
  standalone: true,
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastsContainerComponent, LoadingBarRouterModule],
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

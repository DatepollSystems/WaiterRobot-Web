import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppOutsideLayoutComponent} from '../_shared/ui/app-outside-layout.component';

@Component({
  template: `
    <outside-layout-component>
      <div class="card w-100">
        <div class="card-body">
          <router-outlet />
        </div>
      </div>
    </outside-layout-component>
  `,
  selector: 'app-mobile-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoWithTextComponent, FooterModule, RouterOutlet, AppOutsideLayoutComponent],
})
export class WebLinkComponent {}

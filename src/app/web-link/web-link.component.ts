import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';

@Component({
  template: `
    <div class="d-container d-flex flex-column gap-4 text-white">
      <app-logo-with-text />
      <div class="card bg-dark mx-auto col-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mb-3">
        <div class="card-body">
          <router-outlet />
        </div>
      </div>
    </div>
    <app-footer />
  `,
  styleUrls: ['../about/about.component.scss'],
  selector: 'app-mobile-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoWithTextComponent, FooterModule, RouterOutlet],
})
export class WebLinkComponent {}

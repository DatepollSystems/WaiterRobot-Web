import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AppOutsideLayoutComponent} from '../_shared/ui/app-outside-layout.component';

@Component({
  template: `
    <outside-layout-component>
      <router-outlet />
    </outside-layout-component>
  `,
  selector: 'app-mobile-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AppOutsideLayoutComponent],
})
export class MobileLinkComponent {}

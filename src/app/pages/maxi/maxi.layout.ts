import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {ThemeSwitcherComponent} from '../../components/theme-switcher.component';

@Component({
  template: `
    <div class="container container-md pt-5">
      <router-outlet />
    </div>
    <app-theme-switcher />
  `,
  selector: 'app-outside-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ThemeSwitcherComponent],
})
export class MaxiLayout {}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeSwitcherComponent} from '@shared/ui/theme-switcher.component';

@Component({
  template: `
    <div class="container container-md pt-5">
      <router-outlet />
    </div>
    <app-theme-switcher />
  `,
  selector: 'app-outside-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, BiComponent, ThemeSwitcherComponent],
})
export class MaxiLayout {}

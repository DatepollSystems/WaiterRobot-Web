import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {ThemeSwitcherComponent} from '@shared/ui/theme-switcher.component';

import {BiComponent} from 'dfx-bootstrap-icons';

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
  standalone: true,
})
export class MaxiLayout {}

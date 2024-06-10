import {ChangeDetectionStrategy, Component} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  template: `
    <h1>{{ 'ABOUT_IMPRINT' | transloco }}</h1>

    <h3 class="mt-4">Media owner / Medieninhaber<br /></h3>
    <ul>
      <li>Alexander Kauer, 2095 Drosendorf Altstadt</li>
      <li>Dominik Dafert, 1100 Wien</li>
    </ul>

    <h3 class="mt-4">Contact / Kontakt <br /></h3>

    <ul>
      <li><a href="mailto:contact@kaulex.dev" rel="noreferrer">contact&#64;kaulex.dev</a></li>
      <li>
        <a href="mailto:contact@dafnik.me" rel="noreferrer">contact&#64;dafnik.me</a>
      </li>
    </ul>
  `,
  selector: 'app-imprint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  standalone: true,
})
export class ImprintComponent {}

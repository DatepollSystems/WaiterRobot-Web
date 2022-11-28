import {Component} from '@angular/core';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <h1>{{ 'ABOUT_IMPRINT' | tr }}</h1>

    <h3>Media owner / Medieninhaber<br /></h3>

    <p>Dominik Dafert, 1100 Wien</p>

    <h3>Contact / Kontakt <br /></h3>

    <ul>
      <li><a href="mailto:kaulex@datepollsystems.org">kaulex@datepollsystems.org</a></li>
      <li>
        <a href="mailto:dafnik@datepollsystems.org">dafnik@datepollsystems.org</a>
      </li>
    </ul>
  `,
  selector: 'app-imprint',
  imports: [DfxTr],
  standalone: true,
})
export class ImprintComponent {}
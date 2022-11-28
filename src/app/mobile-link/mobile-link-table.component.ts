import {Component} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';

@Component({
  template: ' <p class="card-text">Coming soon...</p> ',
  standalone: true,
  selector: 'app-mobile-link-table',
  imports: [DfxTranslateModule],
})
export class MobileLinkTableComponent {}
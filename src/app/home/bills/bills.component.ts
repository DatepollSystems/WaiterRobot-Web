import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {NgxBootstrapIconsModule} from 'ngx-bootstrap-icons';

import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: ` <entities-layout-component>
    <div class="d-flex flex-column gap-2" nav>
      <div class="list-group">
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="cash-coin" />
          {{ 'Rechnungen' | tr }}
        </a>
        <a class="list-group-item list-group-item-action" routerLink="unpaid" routerLinkActive="active">
          <i-bs name="book-half" />
          {{ 'Unpaid Reasons' | tr }}
        </a>
      </div>
    </div>
  </entities-layout-component>`,
  selector: 'app-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntitiesLayoutComponent, NgxBootstrapIconsModule, RouterLink, RouterLinkActive, DfxTr],
})
export class BillsComponent {}

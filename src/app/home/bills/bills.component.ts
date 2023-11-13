import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: ` <entities-layout-component>
    <div class="d-flex flex-column gap-2" nav>
      <div class="list-group">
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <bi name="cash-coin" />
          {{ 'Rechnungen' | tr }}
        </a>
        <a class="list-group-item list-group-item-action" routerLink="unpaidReasons" routerLinkActive="active">
          <bi name="book-half" />
          {{ 'HOME_BILL_UNPAID_REASON' | tr }}
        </a>
      </div>
    </div>
  </entities-layout-component>`,
  selector: 'app-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntitiesLayoutComponent, RouterLink, RouterLinkActive, DfxTr, BiComponent],
})
export class BillsComponent {}

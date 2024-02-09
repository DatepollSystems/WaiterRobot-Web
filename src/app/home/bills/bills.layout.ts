import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {EntitiesLayout} from '../_shared/layouts/entities.layout';

@Component({
  template: ` <entities-layout>
    <ng-container nav>
      <div class="list-group">
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <bi name="cash-coin" />
          {{ 'NAV_BILLS' | tr }}
        </a>
        <a class="list-group-item list-group-item-action" routerLink="reasons/all" routerLinkActive="active">
          <bi name="book-half" />
          {{ 'HOME_BILL_UNPAID_REASON' | tr }}
        </a>
      </div>
    </ng-container>
  </entities-layout>`,
  selector: 'app-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EntitiesLayout, RouterLink, RouterLinkActive, DfxTr, BiComponent],
})
export class BillsLayout {}

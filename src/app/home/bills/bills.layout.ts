import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {EntitiesLayout} from '../_shared/layouts/entities.layout';

@Component({
  template: ` <entities-layout>
    <ng-container nav>
      <div class="list-group">
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <bi name="cash-coin" />
          {{ 'NAV_BILLS' | transloco }}
        </a>
        <a class="list-group-item list-group-item-action" routerLink="reasons/all" routerLinkActive="active">
          <bi name="book-half" />
          {{ 'HOME_BILL_UNPAID_REASON' | transloco }}
        </a>
      </div>
    </ng-container>
  </entities-layout>`,
  selector: 'app-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EntitiesLayout, RouterLink, RouterLinkActive, TranslocoPipe, BiComponent],
})
export class BillsLayout {}

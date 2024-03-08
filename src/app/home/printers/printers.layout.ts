import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {EntitiesLayout} from '../_shared/layouts/entities.layout';

@Component({
  template: `
    <entities-layout>
      <ng-container nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <bi name="printer" />
            {{ 'NAV_PRINTERS' | transloco }}</a
          >
          <a class="list-group-item list-group-item-action" routerLink="mediators/all" routerLinkActive="active">
            <bi name="router" />
            {{ 'HOME_PRINTER_NAV_MEDIATOR' | transloco }}</a
          >
        </div>
      </ng-container>
    </entities-layout>
  `,
  selector: 'app-printers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoPipe, BiComponent, EntitiesLayout],
})
export class PrintersLayout {}

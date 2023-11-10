import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: `
    <entities-layout-component>
      <ng-container nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="printers" routerLinkActive="active">
            <bi name="printer" />
            {{ 'NAV_PRINTERS' | tr }}</a
          >
          <a class="list-group-item list-group-item-action" routerLink="mediators" routerLinkActive="active">
            <bi name="router" />
            {{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</a
          >
        </div>
      </ng-container>
    </entities-layout-component>
  `,
  selector: 'app-printers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, BiComponent, AppEntitiesLayoutComponent],
})
export class PrintersComponent {}

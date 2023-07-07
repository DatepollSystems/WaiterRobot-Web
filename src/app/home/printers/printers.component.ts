import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

@Component({
  template: `
    <entities-layout-component>
      <ng-container nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="printers" routerLinkActive="active">
            <i-bs name="printer" />
            {{ 'NAV_PRINTERS' | tr }}</a
          >
          <a class="list-group-item list-group-item-action" routerLink="mediators" routerLinkActive="active">
            <i-bs name="router" />
            {{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</a
          >
        </div>
      </ng-container>
    </entities-layout-component>
  `,
  selector: 'app-printers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent],
})
export class PrintersComponent {}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {DfxTr} from 'dfx-translate';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  template: `
    <entities-layout-component showNav="false">
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="list-ul"></i-bs>
          {{ 'HOME_ORDERS_ALL' | tr }}</a
        >
      </div>
    </entities-layout-component>
  `,
  selector: 'app-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, AppEntitiesLayoutComponent, AppIconsModule],
})
export class OrdersComponent {}

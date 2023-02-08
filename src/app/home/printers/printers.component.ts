import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {getEventsOrderedBySelected} from '../events/_services/getEventsOrderedBySelected';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="mediators" routerLinkActive="active">
          <i-bs name="router"></i-bs>
          {{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</a
        >

        <app-list-nav-items path="/home/printers/event/" [entities]="events$ | async"></app-list-nav-items>
      </div>
    </entities-layout-component>
  `,
  selector: 'app-printers',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
})
export class PrintersComponent {
  events$ = getEventsOrderedBySelected();
}

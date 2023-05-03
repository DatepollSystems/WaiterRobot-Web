import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {getEventsOrderedBySelected} from '../events/_services/getEventsOrderedBySelected';

@Component({
  template: `
    <entities-layout-component>
      <div class="d-flex flex-column gap-2" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="mediators" routerLinkActive="active">
            <i-bs name="router" />
            {{ 'HOME_PRINTER_NAV_MEDIATOR' | tr }}</a
          >
        </div>
        <app-list-nav-items path="/home/printers/event/" [entities]="events$ | async" selectTr="HOME_EVENTS_SELECT" />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-printers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
})
export class PrintersComponent {
  events$ = getEventsOrderedBySelected();
}

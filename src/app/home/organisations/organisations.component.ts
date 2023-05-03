import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {getOrderBySelected} from '../../_shared/services/getOrderBySelected';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  selector: 'app-organisations',
  template: `
    <entities-layout-component>
      <div class="d-flex flex-column gap-2" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <i-bs name="building" />
            {{ 'HOME_ORGS_ALL' | tr }}</a
          >
        </div>
        <app-list-nav-items path="/home/organisations/" [entities]="organisations$ | async" selectTr="HOME_ORGS_SELECT" />
      </div>
    </entities-layout-component>
  `,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrganisationsComponent {
  organisations$ = getOrderBySelected(inject(OrganisationsService));
}

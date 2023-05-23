import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

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
      </div>
    </entities-layout-component>
  `,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrganisationsComponent {}

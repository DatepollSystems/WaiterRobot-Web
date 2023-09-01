import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <i-bs name="columns-gap" />
            {{ 'HOME_PROD_ALL' | tr }}</a
          >

          <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
            <i-bs name="diagram-3" />
            {{ 'HOME_PROD_GROUP' | tr }}</a
          >
        </div>

        <app-list-nav-items
          path="/home/products/groups/products/"
          [entities]="productGroups$ | async"
          titleTr="HOME_PROD_GROUP"
          selectTr="HOME_PROD_GROUP_SELECT"
        />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    DfxTr,
    DfxTrackById,
    AppIconsModule,
    AppEntitiesLayoutComponent,
    AppListNavItemsComponent,
  ],
})
export class ProductsComponent {
  productGroups$ = inject(ProductGroupsService).getAll$();
}

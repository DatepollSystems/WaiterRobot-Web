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
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="columns-gap" />
          {{ 'HOME_PROD_ALL' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
          <i-bs name="diagram-3" />
          {{ 'HOME_PROD_GROUP' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="/home/products/create" routerLinkActive="active">
          <i-bs name="plus-circle" />
          {{ 'HOME_PROD_ADD' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="/home/products/groups/create" routerLinkActive="active">
          <i-bs name="plus-circle" />
          {{ 'HOME_PROD_GROUPS_ADD' | tr }}</a
        >

        <app-list-nav-items path="/home/products/groups/products/" [entities]="productGroups$ | async" />
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

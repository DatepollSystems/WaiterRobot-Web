import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppTextWithColorIndicatorComponent} from '../_shared/components/color/app-text-with-color-indicator.component';
import {AppListNavItemDirective, AppListNavItemsComponent} from '../_shared/layouts/app-list-nav-items.component';
import {EntitiesLayout} from '../_shared/layouts/entities.layout';
import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <entities-layout>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <bi name="columns-gap" />
            {{ 'HOME_PROD_ALL' | transloco }}</a
          >

          <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
            <div class="d-flex justify-content-between">
              <div>
                <bi name="diagram-3" />
                {{ 'HOME_PROD_GROUPS' | transloco }}
              </div>
              <div>
                <span class="badge bg-secondary rounded-pill" ngbTooltip="Gruppenanzahl" placement="left">
                  {{ productGroups()?.length ?? '-' }}
                </span>
              </div>
            </div>
          </a>
        </div>

        <app-list-nav-items
          path="groups/products/"
          titleTr="HOME_PROD_GROUPS"
          selectTr="HOME_PROD_GROUP_SELECT"
          [entities]="productGroups() ?? []"
        >
          <ng-template let-entity appListNavItem>
            <app-text-with-color-indicator [color]="entity.color">
              {{ entity.name }}
            </app-text-with-color-indicator>
          </ng-template>
        </app-list-nav-items>
      </div>
    </entities-layout>
  `,
  selector: 'app-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    BiComponent,
    EntitiesLayout,
    AppListNavItemsComponent,
    AppListNavItemDirective,
    AppTextWithColorIndicatorComponent,
    NgbTooltip,
  ],
})
export class ProductsLayout {
  productGroups = toSignal(inject(ProductGroupsService).getAll$());
}

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {injectParams} from 'ngxtension/inject-params';

import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppTextColorByBackgroundDirective} from '@home-shared/components/color/app-text-color-by-background.directive';

import {ThemeService} from '@shared/services/theme.service';

import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_PROD_ALL' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul class="nav-tabs mb-3" [activeId]="activeId()" ngbNav>
        <li ngbNavItem="all">
          <a ngbNavLink routerLink="../all" routerLinkActive="tab-active">{{ 'ALL' | transloco }}</a>
        </li>
        @for (productGroup of productGroups(); track productGroup.id) {
          <li [ngbNavItem]="productGroup.id.toString()">
            <a
              [routerLink]="'../' + productGroup.id"
              [style.background-color]="productGroup.color | adjustDarkModeColor: currentTheme().id"
              ngbNavLink
              routerLinkActive="tab-active"
            >
              <span [color]="productGroup.color" app-text-color-by-background>
                {{ productGroup.name }}
              </span>
            </a>
          </li>
        }
      </ul>
    </div>

    <router-outlet />
  `,
  selector: 'app-products-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoPipe,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    RouterOutlet,
    AppAdjustDarkModeColor,
    AppTextColorByBackgroundDirective,
    RouterLinkActive,
  ],
})
export class ProductsLayout {
  activeId = injectParams('id');
  productGroups = toSignal(inject(ProductGroupsService).getAll$(), {
    initialValue: [],
  });
  currentTheme = inject(ThemeService).currentTheme;
}

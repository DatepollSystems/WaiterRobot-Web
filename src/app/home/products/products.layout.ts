import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectParams} from 'ngxtension/inject-params';
import {ProductGroupsService} from './_services/product-groups.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_PROD_ALL' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId()">
        <li ngbNavItem="all">
          <a ngbNavLink routerLink="../all">{{ 'ALL' | transloco }}</a>
        </li>
        @for (productGroup of productGroups(); track productGroup.id) {
          <li [ngbNavItem]="productGroup.id.toString()">
            <a ngbNavLink [routerLink]="'../' + productGroup.id">
              <app-text-with-color-indicator [color]="productGroup.color">
                {{ productGroup.name }}
              </app-text-with-color-indicator>
            </a>
          </li>
        }
      </ul>
    </div>

    <router-outlet />
  `,
  styles: '',
  selector: 'app-products-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, NgbNav, NgbNavItem, NgbNavLink, RouterOutlet, AppTextWithColorIndicatorComponent],
})
export class ProductsLayout {
  activeId = injectParams('id');
  productGroups = toSignal(inject(ProductGroupsService).getAll$(), {
    initialValue: [],
  });
}

import {booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, Input} from '@angular/core';

import {StatisticsService} from '../statistics.service';

@Component({
  template: `
    <app-sum-statistics [sumDtos]="sumDtos()" [height]="sumDtos().length * 2.3">
      <span>{{ 'HOME_PROD_ALL' | tr }}</span>
      @if (standalone) {
        <div top>
          <scrollable-toolbar>
            <back-button />
            <div>
              <button class="btn btn-primary btn-sm" print printSectionId="chart">
                <bi name="printer" />
                {{ 'PRINT' | tr }}
              </button>
            </div>
          </scrollable-toolbar>
        </div>
      } @else {
        <div bottom>
          <a class="btn btn-info btn-sm" routerLink="products">{{ 'SHOW_ALL' | tr }}</a>
        </div>
      }
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsComponent {
  @Input({transform: booleanAttribute}) standalone = true;

  sumProducts = inject(StatisticsService).sumProducts;

  sumDtos = computed(() => (this.standalone ? this.sumProducts() : this.sumProducts().slice(0, 20)));
}

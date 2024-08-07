import {booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';

import {StatisticsService} from '../statistics.service';

@Component({
  template: `
    <app-sum-statistics [sumDtos]="sumDtos()" [height]="sumDtos().length * 2.3">
      <span>{{ 'HOME_PROD_ALL' | transloco }}</span>
      @if (standalone()) {
        <div top>
          <scrollable-toolbar>
            <back-button />
            <div>
              <button type="button" class="btn btn-primary btn-sm" ngxPrint printSectionId="chart">
                <bi name="printer" />
                {{ 'PRINT' | transloco }}
              </button>
            </div>
            <app-blur-toggle />
          </scrollable-toolbar>
        </div>
      } @else {
        <div bottom>
          <a class="btn btn-info btn-sm" routerLink="products">{{ 'SHOW_ALL' | transloco }}</a>
        </div>
      }
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsComponent {
  standalone = input(booleanAttribute(true), {transform: booleanAttribute});

  sumProducts = inject(StatisticsService).sumProducts;

  sumDtos = computed(() => (this.standalone() ? this.sumProducts() : this.sumProducts().slice(0, 20)));
}

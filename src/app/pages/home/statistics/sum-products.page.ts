import {ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgxPrintDirective} from 'ngx-print';

import {AppBackButtonComponent} from '../../../components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../../components/scrollable-toolbar.component';
import {BlurToggleComponent} from '../../../components/statistics/blur-toggle.component';
import {StatisticsModule} from '../../../components/statistics/statistics.module';
import {StatisticsService} from '../../../services/statistics.service';

@Component({
  template: `
    <app-sum-statistics [sumDtos]="sumDtos()" [height]="sumDtos().length * 2.3">
      <span>{{ 'HOME_PROD_ALL' | transloco }}</span>
      @if (standalone()) {
        <div top>
          <scrollable-toolbar>
            <back-button />
            <div>
              <button class="btn btn-primary btn-sm" type="button" ngxPrint printSectionId="chart">
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
  imports: [
    StatisticsModule,
    ScrollableToolbarComponent,
    AppBackButtonComponent,
    BlurToggleComponent,
    TranslocoPipe,
    NgxPrintDirective,
    RouterLink,
  ],
})
export class SumProductsPage {
  standalone = input(booleanAttribute(true), {transform: booleanAttribute});

  sumProducts = inject(StatisticsService).sumProducts;

  sumDtos = computed(() => (this.standalone() ? this.sumProducts() : this.sumProducts().slice(0, 20)));
}

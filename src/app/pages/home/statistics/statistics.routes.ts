import {Routes} from '@angular/router';

import {StatisticsPage} from './statistics.page';
import {SumProductsPage} from './sum-products.page';

export const ROUTES: Routes = [
  {
    path: '',
    children: [{path: '', component: StatisticsPage}],
  },
  {path: 'products', component: SumProductsPage},
];

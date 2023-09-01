import {ChangeDetectionStrategy, Component} from '@angular/core';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: '<entities-layout-component showNav="false" />',
  selector: 'app-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntitiesLayoutComponent],
})
export class OrdersComponent {}

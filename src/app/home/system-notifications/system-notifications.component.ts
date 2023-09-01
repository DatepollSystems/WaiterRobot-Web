import {ChangeDetectionStrategy, Component} from '@angular/core';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: ' <entities-layout-component showNav="false" /> ',
  selector: 'app-system-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntitiesLayoutComponent],
  standalone: true,
})
export class SystemNotificationsComponent {}

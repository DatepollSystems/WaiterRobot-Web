import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  template: `
    <entities-layout-component showNav="false">
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="sum" routerLinkActive="active">
          <i-bs name="graph-up" />
          {{ 'WHOLE' | tr }} {{ 'NAV_STATISTICS' | tr }}</a
        >
      </div>
    </entities-layout-component>
  `,
  selector: 'app-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {}
